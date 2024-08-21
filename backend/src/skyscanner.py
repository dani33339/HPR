import sys
sys.path.append('/home/ubuntu/backend')
import requests
import re
import json
import requests
from src.Db_helper import DBHelper
from urllib.parse import urlparse, parse_qs
import src.protonvpn as protonvpn
from fake_useragent import UserAgent
import os

db_helper = DBHelper()

# Initialize the UserAgent object
user_agent = UserAgent()

# Generate a random user agent
random_user_agent = user_agent.random

CUSTOM_SEARCH_API_KEY = os.getenv('CUSTOM_SEARCH_API_KEY')
SEARCH_ENGINE_ID = os.getenv('SEARCH_ENGINE_ID')

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
    query = f"{hotel_name} skyscanner"
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
                    if ("skyscanner" in item["link"]) or "tianxun" in item["link"] and "ht-" in item["link"]:
                        last_part = item["link"].split("/")[-1]
                        if not last_part.startswith("ht"):
                            continue
                        last_part = last_part.replace("ht-", "")
                        return last_part
    except requests.exceptions.RequestException as e:
        print("Skyscanner get_id Error:", e)
        return None

# not correct for booking.com as booking requires vpn to display indian prices
# skyscanner blocks this api after few requests so use vpn
def get_prices_and_links(hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children="", selected_currency="USD", hotel_id=None, market="IN"):
    retries = 3
    while retries > 0:
        hotel_data = {}
        new_hotel = False
        if not hotel_id:
            hotel_id = get_hotel_id(hotel_name)
            if not hotel_id:
                return []
            new_hotel = True


        url = f"https://www.skyscanner.com/g/hotels-website/api/prices/v2/{hotel_id}?adults={adults}&checkin={checkin_date}&checkout={checkout_date}&children={children}&currency={selected_currency}&market={market}&locale=en-GB&rooms={no_rooms}"
        
        response = requests.get(url, headers=HEADERS)

        try:
            if response.status_code == 200:
                data = response.text
                rates_dict = {}

                blocks = re.split(r'\n\n', data.strip())
                def extract_info(block):
                    info = {}
                    lines = block.split('\n')
                    info['id'] = int(lines[0].split(': ')[1])
                    info['event'] = lines[1].split(': ')[1]
                    
                    # Extract data using regex
                    match = re.search(r'data: (.+)', block)
                    if match:
                        info['data'] = match.group(1)
                    
                    return info

                # Extract information from each block
                for block in blocks:
                    block_info = extract_info(block)
                    # Parse the 'data' field into a dictionary
                    data_dict = json.loads(block_info['data'])
                    if data_dict:

                        allMainRates = data_dict.get('allMainRates', {}).get('data', {})
                        if allMainRates:
                            for rate in allMainRates:
                                partner_name = rate.get('partnerName')
                                
                                # Check if the partner_name is already in the dictionary
                                if partner_name not in rates_dict:  
                                    rate_url = rate.get('url')
                                    if "skyscanner" not in url:
                                        # may need to change this
                                        rate_url="https://www.skyscanner.co.in" + url
                                    price = rate.get('priceWithFees')
                                    if not price:
                                        continue
                                    price = round(rate.get('priceWithFees'))
                                    rates_dict[partner_name] = {
                                        'channel': "skyscanner",
                                        'partner': partner_name,
                                        'price': price,
                                        'url': rate_url
                                    }
                                if new_hotel:
                                    # Parse the URL to extract query parameters
                                    parsed_url = urlparse(rate_url)
                                    query_params = parse_qs(parsed_url.query)
                                    
                                    star_rating = query_params.get('tm_stars', [None])[0]
                                    hotel_data['stars'] = star_rating
                                    db_helper.append_skyscanner_id(hotel_name, hotel_id, star_rating)
                                    new_hotel = False
                print("Skyscanner successful")                            
                return list(rates_dict.values())
            else:
                response.raise_for_status()
        except Exception as e:
            print(e)
            retries -= 1
            if retries != 0:
                protonvpn.check_status()
                protonvpn.disconnect()
                protonvpn.connect_to_protonvpn()
    print("Skyscanner 3 unsuccessful tries")
    return []
    
    
def get_prices_and_links_multi_markets(hotel_name, checkin_date, checkout_date, selected_currency="USD", adults=2, no_rooms=1, children="", hotel_id=None, markets=["IN", "US", "IL"]):
    if hotel_id is None:
        hotel_id = get_hotel_id(hotel_name)
    result = {}
    for market in markets:
        market_result = get_prices_and_links(hotel_name, checkin_date, checkout_date, adults, no_rooms, children, selected_currency, hotel_id, market)
        if market_result:
            result[market] = market_result

    return result

