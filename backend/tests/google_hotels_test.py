        
import sys
sys.path.append('/home/ubuntu/backend')

import unittest
import datetime
import src.google_hotels as google_hotels
import src.protonvpn as protonvpn

class TestGoogleHotelsScraper(unittest.TestCase):

    today = datetime.datetime.today()
    checkin_date = (datetime.datetime.today() + datetime.timedelta(days=60)).strftime("%Y-%m-%d")
    checkout_date = (datetime.datetime.today() + datetime.timedelta(days=61)).strftime("%Y-%m-%d")

    def test_get_prices_and_links(self):
        hotel_name = "Kaani Palm Beach"
        protonvpn.connect_to_india()
        result = google_hotels.get_prices_and_links(hotel_name, self.checkin_date, self.checkout_date)
        self.assertGreater(len(result), 0)


if __name__ == "__main__":
    unittest.main(defaultTest='TestGoogleHotelsCrawler.test_get_prices_and_links')
