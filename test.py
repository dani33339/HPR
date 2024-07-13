import requests

url = 'http://129.159.151.202:5000/search'
payload = {
    'hotel_name': 'Club Hotel Eilat',
    'checkin_date': '2024-10-16',
    'checkout_date': '2024-10-17',
    'adults': 2,
    'no_rooms': 1,
    'children': "",
    'user_id': ''
}

response = requests.post(url, json=payload)
if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}, {response.text}")