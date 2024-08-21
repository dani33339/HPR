import sys
sys.path.append('/home/ubuntu/backend')

from seleniumwire import webdriver
import json
from src.Db_helper import DBHelper
import requests
from src.currency_helper import get_exchange_rate
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
import src.protonvpn as protonvpn
import logging
from selenium.webdriver.support import expected_conditions as EC
import brotli
from urllib.parse import unquote
import os
import signal
from random_user_agent.user_agent import UserAgent
from random_user_agent.params import SoftwareName, OperatingSystem
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By


RETRIES = 2

CUSTOM_SEARCH_API_KEY = os.getenv('CUSTOM_SEARCH_API_KEY')
SEARCH_ENGINE_ID = os.getenv('SEARCH_ENGINE_ID')

db_helper = DBHelper()

# Setting up random user agent
software_names = [SoftwareName.FIREFOX.value, SoftwareName.CHROME.value]
operating_systems = [OperatingSystem.WINDOWS.value, OperatingSystem.LINUX.value, OperatingSystem.MAC_OS_X.value]
user_agent_rotator = UserAgent(software_names=software_names, operating_systems=operating_systems, limit=100)

random_user_agent = user_agent_rotator.get_random_user_agent()
logging.getLogger('seleniumwire').setLevel(logging.WARNING)  #disables all logs from selenium wire

firefox_options = Options()
firefox_options.add_argument('-private') 
firefox_options.set_preference("general.useragent.override", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36")
firefox_options.set_preference("dom.webdriver.enabled", False)
firefox_options.set_preference('useAutomationExtension', False)
firefox_options.set_preference("media.peerconnection.enabled", False)  # Disable WebRTC to hide IP leaks
firefox_options.add_argument("--window-size=1920,1080")
service = Service('/home/ubuntu/backend/geckodriver')

# firefox_options.add_argument("--headless")

def get_hotel_id(hotel_name):
    if '&' in hotel_name:
        hotel_name = hotel_name.split('&')[0]
    query = f"{hotel_name} momondo"
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": query,
        "cx": SEARCH_ENGINE_ID,
        "key": CUSTOM_SEARCH_API_KEY,
        "num": 10,
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  
        result = response.json()
        if "items" in result:
            for item in result["items"]:
                if "link" in item:
                    if "momondo" in item["link"] and "hotels/" in item["link"] and hotel_name.split(" ")[0].lower() in item["link"].lower():
                        url = unquote(item["link"])
                        code = url.split(".")[-2][3:]
                        hotel_name = url.split('/')[-1].split(".")[0]
                        return f"{hotel_name}-h{code}"
    except requests.exceptions.RequestException as e:
        print("momondo get_id Error:", e)
        return None

class TimeoutException(Exception):
    pass

def timeout_handler(signum, frame):
    raise TimeoutException

def get_prices_and_links(hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children=0, hotel_id=None):
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(10000)  # Set the timeout to 60 seconds

    try:
        if not hotel_id:
            hotel_id = get_hotel_id(hotel_name)
            if not hotel_id:
                print("Error: Unable to find hotel ID")
                return None
        
            db_helper.append_momondo_id(hotel_name, hotel_id)
            
        page_url = f"https://www.momondo.in/hotel-search/{hotel_id}-details/{checkin_date}/{checkout_date}/2adults"

        retries = RETRIES
        while retries > 0:
            driver = None
            try: 
                driver = webdriver.Firefox(options=firefox_options, service=service)
                driver.get(page_url)
                hotel_dict = {}

                for request in driver.requests:
                    if "api/search/v1/hotels/rates" not in request.url and "/i/api/search/v1/hotels/poll" not in request.url:
                        continue

                    if not request.response:
                        continue

                    decoded_content = brotli.decompress(request.response.body)

                    data = json.loads(decoded_content)

                    for deal in data['groups'][0]['rows']:
                        partner = deal['bookingOptions'][0]['localizedProviderName']
                        hotel_dict[partner] = {
                        'channel': "momondo",
                        'partner': partner,
                        'price': round(deal['bookingOptions'][0]['totalPrice']['price'] / get_exchange_rate("INR")),
                        'url': "https://www.momondo.in" + deal['bookingOptions'][0]['bookingUrl']
                        }
                    print("momondo successful")
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
                    print("momondo retrying")
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

    print("momondo: 2 unsuccessful tries")
    return []



