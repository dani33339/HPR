        
import sys
sys.path.append('/home/ubuntu/backend')

from datetime import date, datetime
from src.Db_helper import DBHelper
import src.skyscanner as skyscanner
import src.trivago as trivago
import src.google_hotels as google_hotels
import src.momondo as momondo
import os
import requests
import time
import src.protonvpn as protonvpn
import timeout_decorator

db_helper = DBHelper()
PLACES_API_KEY = os.getenv('PLACES_API_KEY')

def create_search_id(user_id, hotel_name, checkin_date, checkout_date, adults, no_rooms, children):
    sr_id = hotel_name.replace(" ", "")
    sr_id += checkin_date.strftime("%Y-%m-%d") if type(checkin_date) == date else checkin_date
    sr_id += checkout_date.strftime("%Y-%m-%d") if type(checkout_date) == date else checkout_date
    sr_id += str(adults)
    sr_id += str(no_rooms)
    sr_id += str(children)
    sr_id += str(user_id)
    sr_id += datetime.now().strftime("%Y%m%d%H%M%S")

    db_helper.create_search_request(hotel_name, checkin_date, checkout_date, adults, no_rooms, children, sr_id, user_id)

    return sr_id



def get_hotel_data_from_google(hotel_name):
    base_url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
    query = f'{hotel_name}'
    params = {'query': query, 'key': PLACES_API_KEY}

    response = requests.get(base_url, params=params)
    results = response.json()

    if response.status_code == 200:
        # Assuming the first result is the desired hotel
        if results.get('results'):
            hotel = results['results'][0]

            photo_url=None
            if 'photos' in hotel:
                photo_reference = hotel['photos'][0]['photo_reference']
                photo_url = f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={PLACES_API_KEY}'
            else:
                print("No photos available.")
            
            hotel_info = {
                'name': hotel['name'],
                'address': hotel.get('formatted_address', 'N/A'),
                'rating': hotel.get('rating', 'N/A'),
                'image_url': photo_url
            }
            return hotel_info
        else:
            print("No results found.")
    else:
        print(f"Error: {response.status_code} - {results.get('error_message', 'Unknown Error')}")

    
def search(hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children="", user_id="test", user_role=""):
    start_time = time.time()  # Record the start time

    skyscanner_deals = []
    trivago_deals = []
    google_deals = []
    momondo_deals = []

    sr_id = create_search_id(user_id, hotel_name, checkin_date, checkout_date, adults, no_rooms, children)
    hotel_data = db_helper.get_hotel_data_by_name(hotel_name)
    if not hotel_data:
        hotel_data = get_hotel_data_from_google(hotel_name)
        db_helper.append_hotel_data(hotel_data)

    skyscanner_deals = skyscanner_search(hotel_data, sr_id, hotel_name, checkin_date, checkout_date, adults, no_rooms, children)

    if user_role == "vip":
        try:
            trivago_deals = trivago_search(hotel_data, sr_id, hotel_name, checkin_date, checkout_date, adults, no_rooms, children)
        except Exception as e:
            print(f"An error occurred in the 'trivago' function: {e}")
        try:
            google_deals = google_hotels_search(sr_id, hotel_name, checkin_date, checkout_date, adults, no_rooms, children)
        except Exception as e:
            print(f"An error occurred in the 'google' function: {e}")
        
        # use momondo only when trivago or google didn't work
        if len(trivago_deals) == 0 or len(google_deals) == 0:
            try:
                momondo_deals = momondo_search(hotel_data, sr_id, hotel_name, checkin_date, checkout_date, adults, no_rooms, children)
            except Exception as e:
                print(f"An error occurred in the 'momondo' function: {e}")

    result_dict = {}
    result_dict["skyscanner_deals"] = skyscanner_deals
    result_dict["trivago_deals"] = trivago_deals
    result_dict["google_deals"] = google_deals
    result_dict["momondo_deals"] = momondo_deals
    result_dict["hotel_data"] = db_helper.get_hotel_data_by_name(hotel_name)

    end_time = time.time()  
    execution_time = end_time - start_time 
    print("Execution Time:", execution_time, "seconds")
    protonvpn.disconnect()
    return result_dict


def skyscanner_search(hotel_data, sr_id, hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children=""):
    try:
        # cache deals
        cache_deals = db_helper.get_cache_deals(hotel_name, checkin_date, checkout_date, adults, no_rooms, children, channel="skyscanner")
        if cache_deals:
            return cache_deals
        if 'skyscanner_id' in hotel_data and hotel_data['skyscanner_id']:
            skyscanner_id = hotel_data['skyscanner_id']
        else:
            skyscanner_id = None
        protonvpn.connect_to_protonvpn()
        skyscanner_deals = skyscanner.get_prices_and_links(hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children="", hotel_id=skyscanner_id, market="IN")
        db_helper.insert_deals(skyscanner_deals, sr_id, channel="skyscanner")

        return skyscanner_deals
    except timeout_decorator.timeout_decorator.TimeoutError:
        print(f"skyscanner_search timed out after 60 seconds")
        return []
    except Exception as e:
        print(f"An error occurred in the 'skyscanner' function: {e}")
        return []

def trivago_search(hotel_data, sr_id, hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children=""):
    try:
        cache_deals_trivago = db_helper.get_cache_deals(hotel_name, checkin_date, checkout_date, adults, no_rooms, children, channel="trivago")
        if cache_deals_trivago:
            trivago_deals = cache_deals_trivago
        else:
            if 'trivago_id' in hotel_data and hotel_data['trivago_id']:
                trivago_id = hotel_data['trivago_id']
            else:
                trivago_id = None
            protonvpn.connect_to_india()
            trivago_deals = trivago.get_prices_and_links(hotel_name, checkin_date, checkout_date, selected_currency="USD", adults=2, no_rooms=1, children=0, hotel_id=trivago_id)
            db_helper.insert_deals(trivago_deals, sr_id, channel="trivago")

        return trivago_deals
    except timeout_decorator.timeout_decorator.TimeoutError:
        print(f"trivago_search timed out after 60 seconds")
        return []
    except Exception as e:
        print(f"An error occurred in the 'trivago_search' function: {e}")
        return []

def google_hotels_search(sr_id, hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children=""):
    try:
        cache_deals_google = db_helper.get_cache_deals(hotel_name, checkin_date, checkout_date, adults, no_rooms, children, channel="google")
        if cache_deals_google:
            google_deals = cache_deals_google
        else:
            protonvpn.connect_to_india()
            google_deals = google_hotels.get_prices_and_links(hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children=0)
            db_helper.insert_deals(google_deals, sr_id, channel="google")

        return google_deals
    except timeout_decorator.timeout_decorator.TimeoutError:
        print(f"google_hotels_search timed out after 60 seconds")
        return []
    except Exception as e:
        print(f"An error occurred in the 'google_hotels_search' function: {e}")
        return []

def momondo_search(hotel_data, sr_id, hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children=""):
    try:
        cache_deals_momondo = db_helper.get_cache_deals(hotel_name, checkin_date, checkout_date, adults, no_rooms, children, channel="momondo")
        if cache_deals_momondo:
            momondo_deals = cache_deals_momondo
        else:
            if 'momondo_id' in hotel_data and hotel_data['momondo_id']:
                momondo_id = hotel_data['momondo_id']
            else:
                momondo_id = None
            protonvpn.connect_to_india()
            momondo_deals = momondo.get_prices_and_links(hotel_name, checkin_date, checkout_date, adults=2, no_rooms=1, children=0, hotel_id=momondo_id)
            db_helper.insert_deals(momondo_deals, sr_id, channel="momondo")

        return momondo_deals
    except timeout_decorator.timeout_decorator.TimeoutError:
        print(f"momondo_search timed out after 60 seconds")
        return []
    except Exception as e:
        print(f"An error occurred in the 'momondo_search' function: {e}")
        return []
        

