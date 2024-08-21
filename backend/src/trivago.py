import sys
sys.path.append('/home/ubuntu/backend')

from seleniumwire import webdriver
import json
import gzip
from src.Db_helper import DBHelper
import requests
from urllib.parse import unquote
from datetime import datetime
from src.currency_helper import get_exchange_rate
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
import src.protonvpn as protonvpn
import logging
from fake_useragent import UserAgent
import os
import time
import signal
from selenium.webdriver.common.by import By

RETRIES = 2

user_agent = UserAgent()

# Generate a random user agent
random_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"

db_helper = DBHelper()

CUSTOM_SEARCH_API_KEY = os.getenv('CUSTOM_SEARCH_API_KEY')
SEARCH_ENGINE_ID = os.getenv('SEARCH_ENGINE_ID')

logging.getLogger('seleniumwire').setLevel(logging.WARNING)  # This disables all logs from selenium wire

firefox_options = Options()
firefox_options.add_argument('-private') 
firefox_options.set_preference("dom.webdriver.enabled", False)
firefox_options.set_preference('useAutomationExtension', False)
firefox_options.set_preference("media.peerconnection.enabled", False)  # Disable WebRTC to hide IP leaks
firefox_options.set_preference("general.useragent.override", random_user_agent)
service = Service('/home/ubuntu/backend/geckodriver')
# firefox_options.add_argument("--headless")

partner_id_dict = {
    "395": "agoda",
    "400": "booking",
    "634": "trip",
    "3340": "hotels.com",
    "626": "booking",
    "54": "priceline",
    "3134": "Hilton",
    "406": "expedia",
    "1756": "zenhotels",
    "606": "marriott",
    "1490": "marriott",
    "227": "prestigia",
    "237": "accor",
    "245": "ibis hotels",
    "341": "destinia",
    "251": "accor"
}

HEADERS = {
    "User-Agent": random_user_agent,
    "Accept-Encoding": "gzip, deflate, br",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Connection": "keep-alive",
    "Accept-Language": "en-US,en;q=0.9,lt;q=0.8,et;q=0.7,de;q=0.6",
    "Cache-Control": "max-age=0",
    "DNT": "1",
    "Upgrade-Insecure-Requests": "1",
}


def get_hotel_id(hotel_name):
    if '&' in hotel_name:
        hotel_name = hotel_name.split('&')[0]
    query = f"{hotel_name} trivago"
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": query,
        "cx": SEARCH_ENGINE_ID,
        "key": CUSTOM_SEARCH_API_KEY,
        "num": 10,
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an exception for 4xx/5xx status codes
        result = response.json()
        if "items" in result:
            for item in result["items"]:
                if "link" in item:
                    if "trivago" in item["link"] and "hotel-" in item["link"]:
                        trivago_url = unquote(item["link"])
                        # if "search" not in trivago_url or hotel_name.lower().replace(" ", "-") not in trivago_url:
                        if "search" not in trivago_url:
                            continue
                        last_part = trivago_url.split("/")[-1]
                        # if not last_part.startswith("hotel"):
                        #     continue
                        return last_part
    except requests.exceptions.RequestException as e:
        print("Trivago get_id Error:", e)
        return None

def add_deal_to_hotel_dict(deal, partner_id_dict, hotel_dict, trip_length):
    partner_id = str(deal['advertiser']['nsid']['id'])
    if partner_id in partner_id_dict:
        partner_id = partner_id_dict[partner_id]

    hotel_dict[partner_id] = {
        'channel': "trivago",
        'partner': partner_id,
        'price': round(deal['pricePerNight']['amount'] / get_exchange_rate("INR"))*trip_length,
        'url': deal['clickoutUrl']
    }

class TimeoutException(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutException

def get_prices_and_links(hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children="", selected_currency="USD", hotel_id=None):
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(1000)  

    try:
        if not hotel_id:
            hotel_id = get_hotel_id(hotel_name)
            if not hotel_id:
                print("Error: Unable to find hotel ID")
                return None
        
            db_helper.append_trivago_id(hotel_name, hotel_id)

        trip_length = (datetime.strptime(checkout_date, "%Y-%m-%d") - datetime.strptime(checkin_date, "%Y-%m-%d")).days

        checkin_date = int(checkin_date.replace("-", ""))
        checkout_date = int(checkout_date.replace("-", ""))
        page_url = f"https://www.trivago.in/en-IN/srl/{hotel_id};dr-{checkin_date}-{checkout_date}-s;rc-1-2"
        
        retries = RETRIES
        while retries > 0:
            driver = None
            try:   
                driver = webdriver.Firefox(options=firefox_options, service=service)
                driver.get(page_url)
                hotel_dict = {}

                # slow down to get results
                time.sleep(3)

                # Find the relevant request based on the URL
                for request in driver.requests:
                    if request.url != "https://www.trivago.in/graphql?accommodationSearchQuery":
                        continue

                    if not request.response:
                        continue
                        # raise Exception("Unable to find the response for the hotel deals")

                    content = gzip.decompress(request.response.body)
                    response_json = json.loads(content.decode('utf-8'))
                    deals = response_json['data']['accommodationSearchResponse']['accommodations'][0]['deals']

                    if not deals['best']:
                        continue  # Skip the current iteration if 'best' deals are not present

                    for deal_type in deals:
                        if deal_type == 'alternatives':
                            for deal in deals[deal_type]:
                                add_deal_to_hotel_dict(deal, partner_id_dict, hotel_dict, trip_length)
                        elif deal_type == 'best' or deal_type == 'cheapest':
                            add_deal_to_hotel_dict(deals[deal_type], partner_id_dict, hotel_dict, trip_length)

                print("Trivago successful")
                if hotel_dict:                     
                    return list(hotel_dict.values())
                else:
                    raise RuntimeError
            
            except TimeoutException:
                print("Timeout occurred")
                retries = 0  # Exit loop after timeout
            except Exception as e:
                print(f"An error occurred: {str(e)}")
                retries -= 1
                if retries != 0:
                    print("Trivago retrying")
                    protonvpn.check_status()
                    protonvpn.disconnect()
                    protonvpn.connect_to_india()
            finally:
                if driver:
                    driver.quit()
                
    except TimeoutException:
        print("Timeout occurred before any attempt")
    finally:
        signal.alarm(0)  # Disable the alarm

    print("trivago: 2 unsuccessful tries")
    return []

