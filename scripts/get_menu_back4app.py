#!/usr/bin/env python3

import json
import os
import time
import requests
from datetime import datetime
from collections import defaultdict
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from dotenv import load_dotenv

load_dotenv()

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

        todays_date = datetime.today().strftime("%A, %B %-d, %Y")

        def get_menu_for_correct_day(menu_container):
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
            station = None
            link = WebDriverWait(correct_day, 10).until(EC.element_to_be_clickable((By.LINK_TEXT, meal)))
            link.click()
            itemTable = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "cbo_nn_itemGridTable")))
            rows = itemTable.find_elements(By.TAG_NAME, "tr")
            
            current_station = None
            current_items = []
            
            for row in rows[1:]:
                tds = row.find_elements(By.TAG_NAME, "td")

                if len(tds) == 1:
                    if current_station and current_items:
                        food_by_stations.append({
                            "meal": meal,
                            "station": current_station,
                            "items": current_items.copy(),
                            "date": date,
                            "diningHall": dining_hall
                        })
                    current_station = tds[0].text
                    current_items = []
                else:
                    item_name = tds[1].text.strip()
                    if item_name:
                        current_items.append(item_name)
            
            if current_station and current_items:
                food_by_stations.append({
                    "meal": meal,
                    "station": current_station,
                    "items": current_items,
                    "date": date,
                    "diningHall": dining_hall
                })

            back_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "btn_Back1")))
            back_button.click()

            menu_container = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "cbo_nn_menuCell")))
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

    headers = {
        "X-Parse-Application-Id": os.getenv('BACK4APP_APP_ID'),
        "X-Parse-REST-API-Key": os.getenv('BACK4APP_REST_API_KEY'),
        "X-Parse-Master-Key": os.getenv('BACK4APP_MASTER_KEY'),
        "Content-Type": "application/json"
    }
    base_url = f"{os.getenv('BACK4APP_SERVER_URL')}/classes/Menu"

    try:
        # delete existing records for today; not necessary, only included for testing for when script is executed multiple times in one day
        today = datetime.today().strftime("%A, %B %-d, %Y")
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
                requests.delete(delete_url, headers=headers)

        # upload new records
        success_count = 0
        for item in menu_data:
            response = requests.post(base_url, headers=headers, json=item)
            if response.status_code == 201:
                success_count += 1
            else:
                print(f"Failed to upload {item['meal']}: {response.text}")

        print(f"Successfully uploaded {success_count}/{len(menu_data)} items")
        return success_count == len(menu_data)

    except Exception as e:
        print(f"Upload error: {e}")
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