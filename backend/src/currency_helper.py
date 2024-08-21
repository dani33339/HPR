import requests
import json
import time
import os
from dotenv import load_dotenv

load_dotenv()

def call_endpoint():
    base_url = "https://api.freecurrencyapi.com/v1/latest"
    params = {"apikey": os.getenv("CURRENCY_KEY"), "currencies": "INR,ILS"}

    try:
        response = requests.get(base_url, params=params)
        data = response.json()
        
        if response.status_code == 200:
            rates = data['data']
            return rates
        else:
            print(f"Error: {data['message']}")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def get_exchange_rate(currency):
    if os.path.exists("exchange_rate.txt"):
        current_time = time.time()
        file_modified_time = os.path.getmtime("exchange_rate.txt")
        time_difference = current_time - file_modified_time
        if time_difference > 24 * 60 * 60: 
            rates = call_endpoint()
            if rates is not None:
                with open("exchange_rate.txt", "w") as file:
                    file.write(json.dumps(rates))
                print("Exchange rates updated successfully.")
        else:
            with open("exchange_rate.txt", "r") as file:
                rates = json.loads(file.read())

        if currency in rates:
            return round(rates[currency])
        else:
            print(f"Error: Currency {currency} not found.")
            return None


# get_exchange_rate("INR")