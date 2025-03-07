#!/usr/bin/env python3

import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from datetime import datetime
from collections import defaultdict

def get_menu():
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--headless")

    service = Service("/usr/bin/chromedriver")
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        url = 'https://dining.nd.edu/'
        driver.get(url)

        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'South Dining Hall')]"))).click()
        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.LINK_TEXT, "South Dining Hall"))).click()
        menu_container = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "cbo_nn_menuCell")))

        todays_date = datetime.today().strftime("%A, %B %-d, %Y")

        def get_menu_for_correct_day(menu_container):
            for i in range(len(menu_container)):
                if menu_container[i].text.split('\n')[0] == todays_date:
                    return menu_container[i]
        
        correct_day = get_menu_for_correct_day(menu_container)
        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "cbo_nn_menuLinkCell")))
        meals = correct_day.find_elements(By.CLASS_NAME, "cbo_nn_menuLinkCell")
        meal_links = []
        for meal in meals:
            meal_links.append(meal.text)

        date = correct_day.text.split('\n')[0]
        
        food_by_stations = defaultdict(list)
        food_by_stations2 = {} # restructuring data storage -- ex: food_by_stations2['Breakfast']['Main'] = ['eggs', 'bacon']
        food_by_stations3 = []

        json_output = None
        for meal in meal_links:
            food_by_stations2[meal] = {}


            station = None
            link = WebDriverWait(correct_day, 10).until(EC.element_to_be_clickable((By.LINK_TEXT, meal)))
            link.click()
            itemTable = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "cbo_nn_itemGridTable")))
            itemTable_html = itemTable.get_attribute("innerHTML")
            rows = itemTable.find_elements(By.TAG_NAME, "tr")
            
            for row in rows[1:]:
                tds = row.find_elements(By.TAG_NAME, "td")

                if len(tds) == 1:
                    station = tds[0].text
                    food_by_stations2[meal][station] = []

                    food_items = []
                    temp_set = {}
                    temp_set["meal"] = meal
                    temp_set["station"] = station
                    temp_set["items"] = food_items
                    food_by_stations3.append(temp_set)
                else:
                    food_items.append(tds[1].text)

                    food_by_stations[f"{meal}-{station}"].append(tds[1].text)
                    food_by_stations2[meal][station].append(tds[1].text)
                    json_output = json.dumps(food_by_stations, indent=4)
                    json_output2 = json.dumps(food_by_stations2, indent=4)
            
            
                

            back_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "btn_Back1")))
            back_button.click()

            # refresh correct_day reference (avoid stale reference error)
            menu_container = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "cbo_nn_menuCell")))
            correct_day = get_menu_for_correct_day(menu_container)

        # print(food_by_stations)
        # print(json_output)
        # json_output3 = json.dumps(food_by_stations3)
        print(food_by_stations3)


    except Exception as e:
        print(f"Error: {e}")
        driver.quit()

def main():
    get_menu()

if __name__ == "__main__":
    start_time = time.time()
    main()
    end_time = time.time()
    elapsed_time = end_time - start_time
    # print(f"Elapsed time: {elapsed_time} seconds")
    