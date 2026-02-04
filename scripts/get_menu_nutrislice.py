#!/usr/bin/env python3

import json
import os
import time
from datetime import datetime, timedelta

import pytz
import requests
from dotenv import load_dotenv

load_dotenv()

# Set timezone to Eastern Time (Notre Dame's timezone)
eastern = pytz.timezone('America/New_York')

NUTRISLICE_BASE_URL = "https://nd.api.nutrislice.com/menu/api"

DINING_HALLS = {
    "South Dining Hall": "south-dining-hall",
    "North Dining Hall": "north-dining-hall",
}

WEEKDAY_MEALS = ["breakfast", "lunch", "dinner"]
WEEKEND_MEALS = ["brunch", "dinner"]

LOW_PRIORITY_STATIONS = [
    "Grill Buns", "Asian Stir Fry Sauces", "Deli", "Condiments",
    "Coffee & Tea", "Fountain Drinks", "Milk", "Juices",
    "Toppings", "Waffle and Pancake Toppings"
]


def reorder_stations(menu_data):
    return sorted(
        menu_data,
        key=lambda x: (x["station"] in LOW_PRIORITY_STATIONS,)
    )


def format_menu_date(dt):
    # Cross-platform day formatting (avoid %-d which fails on Windows)
    return dt.strftime("%A, %B %d, %Y").replace(" 0", " ")


def get_week_start(dt):
    # Monday as start of week
    return dt - timedelta(days=dt.weekday())


def build_week_url(hall_slug, meal_slug, date):
    return (
        f"{NUTRISLICE_BASE_URL}/weeks/school/{hall_slug}/"
        f"menu-type/{meal_slug}/{date.year}/{date.month:02d}/{date.day:02d}/?format=json"
    )


def request_json(url):
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.json()


def normalize_allergens(raw):
    if not raw:
        return []
    if isinstance(raw, list):
        allergens = []
        for item in raw:
            if isinstance(item, str):
                allergens.append(item)
            elif isinstance(item, dict):
                name = (
                    item.get("name")
                    or item.get("title")
                    or item.get("allergen")
                    or item.get("text")
                )
                if name:
                    allergens.append(name)
        return allergens
    if isinstance(raw, dict):
        return [k for k, v in raw.items() if v]
    return []


def normalize_nutrients(raw):
    if not raw:
        return []

    if isinstance(raw, dict) and "nutrients" in raw:
        raw = raw.get("nutrients")

    nutrients = []
    if isinstance(raw, list):
        for item in raw:
            if not isinstance(item, dict):
                continue
            name = (
                item.get("name")
                or item.get("nutrient_name")
                or (item.get("nutrient") or {}).get("name")
            )
            value = (
                item.get("value")
                or item.get("amount")
                or item.get("serving_value")
                or item.get("qty")
            )
            uom = item.get("uom") or item.get("unit") or item.get("units")
            if name:
                nutrients.append({"name": name, "value": value, "uom": uom})
        return nutrients

    if isinstance(raw, dict):
        for name, value in raw.items():
            if isinstance(value, (int, float, str)):
                nutrients.append({"name": name, "value": value, "uom": None})
        return nutrients

    return []


def extract_text(value):
    if value is None:
        return None
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, dict):
        return extract_text(value.get("name") or value.get("title") or value.get("text"))
    return None


def extract_item_name(item):
    if not isinstance(item, dict):
        return None
    return (
        extract_text(item.get("name"))
        or extract_text(item.get("text"))
        or extract_text(item.get("menu_item_name"))
        or extract_text((item.get("food") or {}).get("name"))
    )


def extract_station(item, category_fallback=None):
    if not isinstance(item, dict):
        return category_fallback
    for key in [
        "station",
        "station_name",
        "menu_station",
        "category",
        "menu_category",
        "menu_category_name",
        "line_name",
    ]:
        value = extract_text(item.get(key))
        if value:
            return value
    if category_fallback:
        return category_fallback
    return "Other"


def extract_labels(item):
    if not isinstance(item, dict):
        return []
    raw = item.get("labels") or item.get("dietary_flags") or item.get("tags")
    if isinstance(raw, list):
        labels = []
        for label in raw:
            text = extract_text(label)
            if text:
                labels.append(text)
        return labels
    return []


def extract_nutrition(item):
    if not isinstance(item, dict):
        return [], []
    raw_nutrients = (
        item.get("nutrients")
        or item.get("nutrition")
        or item.get("nutrition_info")
        or (item.get("food") or {}).get("nutrients")
        or (item.get("food") or {}).get("nutrition")
        or (item.get("food") or {}).get("nutrition_info")
    )
    raw_allergens = item.get("allergens") or (item.get("food") or {}).get("allergens")
    return normalize_nutrients(raw_nutrients), normalize_allergens(raw_allergens)


def iter_menu_items(day):
    if not isinstance(day, dict):
        return

    if isinstance(day.get("menu_items"), list):
        for item in day["menu_items"]:
            yield item, None
        return

    menu_by_category = day.get("menu_items_by_category")
    if isinstance(menu_by_category, list):
        for category in menu_by_category:
            if not isinstance(category, dict):
                continue
            category_name = extract_text(category.get("category") or category.get("name"))
            items = (
                category.get("menu_items")
                or category.get("items")
                or category.get("menu_items_by_category")
            )
            if isinstance(items, list):
                for item in items:
                    yield item, category_name
        return

    if isinstance(menu_by_category, dict):
        for category_name, items in menu_by_category.items():
            if isinstance(items, list):
                for item in items:
                    yield item, category_name


def parse_day_date(day):
    if not isinstance(day, dict):
        return None
    date_value = day.get("date") or day.get("day") or day.get("menu_date")
    if not date_value:
        return None
    if isinstance(date_value, str):
        try:
            return datetime.fromisoformat(date_value).date()
        except ValueError:
            try:
                return datetime.strptime(date_value, "%Y-%m-%d").date()
            except ValueError:
                return None
    if isinstance(date_value, (int, float)):
        try:
            return datetime.fromtimestamp(date_value).date()
        except OSError:
            return None
    return None


def meal_allowed_on_day(meal_slug, day_date):
    if not day_date:
        return True
    if day_date.weekday() < 5:
        return meal_slug in WEEKDAY_MEALS
    return meal_slug in WEEKEND_MEALS


def fetch_menu_for_hall(hall_name, hall_slug, week_start):
    menu_records = []
    for meal_slug in sorted(set(WEEKDAY_MEALS + WEEKEND_MEALS)):
        url = build_week_url(hall_slug, meal_slug, week_start)
        print(f"Fetching: {url}")
        try:
            data = request_json(url)
        except requests.RequestException as e:
            print(f"Failed to fetch {meal_slug} for {hall_name}: {e}")
            continue
        days = data.get("days") or []
        for day in days:
            day_date = parse_day_date(day)
            if not meal_allowed_on_day(meal_slug, day_date):
                continue

            formatted_date = format_menu_date(
                datetime.combine(day_date, datetime.min.time())
            ) if day_date else None
            if not formatted_date:
                continue

            station_items = {}
            for item, category in iter_menu_items(day):
                name = extract_item_name(item)
                if not name:
                    continue
                station = extract_station(item, category)
                nutrients, allergens = extract_nutrition(item)
                labels = extract_labels(item)

                entry = {
                    "name": name,
                    "nutrients": nutrients,
                    "allergens": allergens,
                    "labels": labels,
                }
                station_items.setdefault(station, []).append(entry)

            meal_title = meal_slug.replace("-", " ").title()
            for station, items in station_items.items():
                if not items:
                    continue
                menu_records.append({
                    "meal": meal_title,
                    "station": station,
                    "items": items,
                    "date": formatted_date,
                    "diningHall": hall_name,
                })

    return menu_records


def upload_to_back4app(menu_data, dining_hall):
    if not menu_data:
        print("No data to upload")
        return False

    required_vars = [
        "BACK4APP_APP_ID",
        "BACK4APP_REST_API_KEY",
        "BACK4APP_MASTER_KEY",
        "BACK4APP_SERVER_URL",
    ]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        print(f"Missing required environment variables: {', '.join(missing_vars)}")
        return False

    headers = {
        "X-Parse-Application-Id": os.getenv("BACK4APP_APP_ID"),
        "X-Parse-REST-API-Key": os.getenv("BACK4APP_REST_API_KEY"),
        "X-Parse-Master-Key": os.getenv("BACK4APP_MASTER_KEY"),
        "Content-Type": "application/json",
    }
    base_url = f"{os.getenv('BACK4APP_SERVER_URL')}/classes/Menu"

    try:
        dates = sorted({item["date"] for item in menu_data if item.get("date")})
        if dates:
            query = {
                "where": json.dumps({
                    "diningHall": dining_hall,
                    "date": {"$in": dates},
                })
            }
            response = requests.get(base_url, headers=headers, params=query)
            response.raise_for_status()
            existing_records = response.json().get("results", [])
            if existing_records:
                print(f"Found {len(existing_records)} existing records, deleting...")
                for record in existing_records:
                    delete_url = f"{base_url}/{record['objectId']}"
                    delete_response = requests.delete(delete_url, headers=headers)
                    if delete_response.status_code != 200:
                        print(f"Failed to delete record {record['objectId']}: {delete_response.text}")

        success_count = 0
        for item in menu_data:
            response = requests.post(base_url, headers=headers, json=item)
            if response.status_code == 201:
                success_count += 1
            else:
                print(
                    f"Failed to upload {item['meal']} at {item['station']}: {response.text}"
                )

        print(f"Successfully uploaded {success_count}/{len(menu_data)} items")
        return success_count == len(menu_data)

    except requests.exceptions.RequestException as e:
        print(f"Upload error: {e}")
        if hasattr(e.response, "text"):
            print(f"Response text: {e.response.text}")
        return False


def main():
    week_start = get_week_start(datetime.now(eastern).date())

    for dining_hall, hall_slug in DINING_HALLS.items():
        start_time = time.time()
        try:
            print(f"Starting menu fetch for {dining_hall}...")
            menu_data = fetch_menu_for_hall(dining_hall, hall_slug, week_start)

            if menu_data:
                print(f"Fetched {len(menu_data)} menu groups")
                menu_data = reorder_stations(menu_data)

                print("Uploading to Back4App...")
                if upload_to_back4app(menu_data, dining_hall):
                    print("Upload successful!")
                else:
                    print("Upload completed with errors")
            else:
                print("Failed to fetch menu data")
        except Exception as e:
            print(f"Fatal error: {e}")
        finally:
            print(f"Completed in {time.time() - start_time:.2f} seconds")


if __name__ == "__main__":
    main()
