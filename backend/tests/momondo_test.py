        
import sys
sys.path.append('/home/ubuntu/backend')

import unittest
import datetime
import src.trivago as trivago
import src.protonvpn as protonvpn
from unittest.mock import patch
import src.currency_helper as currency_helper

class TestMomondoScraper(unittest.TestCase):

    today = datetime.datetime.today()
    checkin_date = (datetime.datetime.today() + datetime.timedelta(days=60)).strftime("%Y-%m-%d")
    checkout_date = (datetime.datetime.today() + datetime.timedelta(days=62)).strftime("%Y-%m-%d")

    def test_get_hotel_id(self):
        hotel_name = "Kaani Palm Beach"
        hotel_id = trivago.get_hotel_id(hotel_name)
        self.assertEqual(hotel_id, 'hotel-kaani-palm-beach-maafushi?search=100-19014848')


    def test_get_prices_and_links(self):
        hotel_name = "Kaani Palm Beach"
        protonvpn.connect_to_india()
        result = trivago.get_prices_and_links(hotel_name, self.checkin_date, self.checkout_date, hotel_id="hotel-kaani-palm-beach-maafushi?search=100-19014848")
        self.assertGreater(len(result), 0)
