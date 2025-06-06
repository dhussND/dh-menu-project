#!/usr/bin/env python3

import json
import os
import time
import requests
from datetime import datetime
import pytz
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from dotenv import load_dotenv

load_dotenv()

# Set timezone to Eastern Time (Notre Dame's timezone)
eastern = pytz.timezone('America/New_York')

LOW_PRIORITY_STATIONS = [
    'Grill Buns', 'Asian Stir Fry Sauces', 'Deli', 'Condiments',
    'Coffee & Tea', 'Fountain Drinks', 'Milk', 'Juices',
    'Toppings', 'Waffle and Pancake Toppings'
]

def reorder_stations(menu_data):
    return sorted(
        menu_data,
        key=lambda x: (x['station'] in LOW_PRIORITY_STATIONS, )
    )


def parse_nutrition_text(text: str) -> dict:
    """Extract nutrition information from the nutrition label text."""
    def match(pattern):
        m = re.search(pattern, text, re.IGNORECASE)
        return m.group(1).strip() if m else ""

    data = {
        "calories": match(r"Calories\s+(\d+)") or "",
        "total_fat": match(r"Total Fat\s+([^\s]+)") or "",
        "saturated_fat": match(r"Saturated Fat\s+([^\s]+)") or "",
        "cholesterol": match(r"Cholesterol\s+([^\s]+)") or "",
        "sodium": match(r"Sodium\s+([^\s]+)") or "",
        "potassium": match(r"Potassium\s+([^\s]+)") or "",
        "carbohydrates": match(r"Total Carbohydrate\s+([^\s]+)") or "",
        "fiber": match(r"Dietary Fiber\s+([^\s]+)") or "",
        "sugars": match(r"Sugars\s+([^\s]+)") or "",
        "protein": match(r"Protein\s+([^\s]+)") or "",
        "calcium": match(r"Calcium\s+([^\s]+)") or "",
        "iron": match(r"Iron\s+([^\s]+)") or "",
    }

    return data

def get_menu(dining_hall):
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=chrome_options)

    try:
        url = 'https://dining.nd.edu/'
        driver.get(url)

        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, f"//a[contains(text(), 'South Dining Hall')]"))).click()
        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.LINK_TEXT, dining_hall))).click()
        menu_container = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "cbo_nn_menuCell")))

        # Get today's date in Eastern Time
        todays_date = datetime.now(eastern).strftime("%A, %B %-d, %Y")
        print(f"Searching for menu for: {todays_date}")

        def get_menu_for_correct_day(menu_container):
            available_dates = [cell.text.split('\n')[0] for cell in menu_container]
            print(f"Available dates: {available_dates}")
            
            for i in range(len(menu_container)):
                if menu_container[i].text.split('\n')[0] == todays_date:
                    return menu_container[i]
            raise ValueError(f"No menu found for {todays_date}")
        
        correct_day = get_menu_for_correct_day(menu_container)
        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "cbo_nn_menuLinkCell")))
        meals = correct_day.find_elements(By.CLASS_NAME, "cbo_nn_menuLinkCell")
        meal_links = [meal.text for meal in meals]

        date = correct_day.text.split('\n')[0]
        food_by_stations = []

        for meal in meal_links:
            link = WebDriverWait(correct_day, 10).until(EC.element_to_be_clickable((By.LINK_TEXT, meal)))
            link.click()

            itemTable = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "cbo_nn_itemGridTable")))
            rows = itemTable.find_elements(By.TAG_NAME, "tr")

            current_station = None

            for row in rows[1:]:
                tds = row.find_elements(By.TAG_NAME, "td")

                if len(tds) == 1:
                    current_station = tds[0].text.strip()
                else:
                    item_name = tds[1].text.strip()
                    if not item_name:
                        continue

                    tds[1].click()
                    label_table = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CLASS_NAME, "cbo_nn_NutritionLabelTable"))
                    )
                    nutrition = parse_nutrition_text(label_table.text)

                    close_btn = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.ID, "btn_nn_detail_close"))
                    )
                    close_btn.click()
                    WebDriverWait(driver, 10).until(EC.staleness_of(label_table))

                    item_record = {
                        "meal": meal,
                        "station": current_station,
                        "item": item_name,
                        "date": date,
                        "diningHall": dining_hall,
                    }
                    item_record.update(nutrition)
                    food_by_stations.append(item_record)

            back_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "btn_Back1")))
            back_button.click()

            menu_container = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, "cbo_nn_menuCell"))
            )
            correct_day = get_menu_for_correct_day(menu_container)

        return food_by_stations

    except Exception as e:
        print(f"Scraping error: {e}")
        return None
    finally:
        driver.quit()

def upload_to_back4app(menu_data):
    if not menu_data:
        print("No data to upload")
        return False

    # Verify environment variables
    required_vars = ['BACK4APP_APP_ID', 'BACK4APP_REST_API_KEY', 'BACK4APP_MASTER_KEY', 'BACK4APP_SERVER_URL']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        print(f"Missing required environment variables: {', '.join(missing_vars)}")
        return False

    headers = {
        "X-Parse-Application-Id": os.getenv('BACK4APP_APP_ID'),
        "X-Parse-REST-API-Key": os.getenv('BACK4APP_REST_API_KEY'),
        "X-Parse-Master-Key": os.getenv('BACK4APP_MASTER_KEY'),
        "Content-Type": "application/json"
    }
    base_url = f"{os.getenv('BACK4APP_SERVER_URL')}/classes/Menu"

    try:
        # delete existing records for today
        today = datetime.now(eastern).strftime("%A, %B %-d, %Y")
        query = {
            "where": json.dumps({
                "date": today,
                "diningHall": "South Dining Hall"
            })
        }
        response = requests.get(base_url, headers=headers, params=query)
        response.raise_for_status()
        
        existing_records = response.json().get('results', [])
        if existing_records:
            print(f"Found {len(existing_records)} existing records, deleting...")
            for record in existing_records:
                delete_url = f"{base_url}/{record['objectId']}"
                delete_response = requests.delete(delete_url, headers=headers)
                if delete_response.status_code != 200:
                    print(f"Failed to delete record {record['objectId']}: {delete_response.text}")

        # upload new records
        success_count = 0
        for item in menu_data:
            response = requests.post(base_url, headers=headers, json=item)
            if response.status_code == 201:
                success_count += 1
            else:
                print(f"Failed to upload {item['meal']} at {item['station']}: {response.text}")

        print(f"Successfully uploaded {success_count}/{len(menu_data)} items")
        return success_count == len(menu_data)

    except requests.exceptions.RequestException as e:
        print(f"Upload error: {e}")
        if hasattr(e.response, 'text'):
            print(f"Response text: {e.response.text}")
        return False

def main():
    dining_halls = ["South Dining Hall",  "North Dining Hall", "Holy Cross College Dining Hall", "Saint Mary's Dining Hall"]
    for dining_hall in dining_halls:
        start_time = time.time()
        try:
            print("Starting menu scraping...")
            menu_data = get_menu(dining_hall)
            
            if menu_data:
                print(f"Scraped {len(menu_data)} menu items")

                # prioritize stations
                menu_data = reorder_stations(menu_data)

                print("Uploading to Back4App...")
                if upload_to_back4app(menu_data):
                    print("Upload successful!")
                else:
                    print("Upload completed with errors")
            else:
                print("Failed to scrape menu data")
        except Exception as e:
            print(f"Fatal error: {e}")
        finally:
            print(f"Completed in {time.time() - start_time:.2f} seconds")

if __name__ == "__main__":
    main()
