        
import sys
sys.path.append('/home/ubuntu/backend')

import unittest
import datetime
import src.skyscanner as skyscanner
import src.protonvpn as protonvpn

class TestSkyscannerScraper(unittest.TestCase):

    today = datetime.datetime.today()
    checkin_date = (datetime.datetime.today() + datetime.timedelta(days=60)).strftime("%Y-%m-%d")
    checkout_date = (datetime.datetime.today() + datetime.timedelta(days=62)).strftime("%Y-%m-%d")

    def test_get_hotel_id(self):
        hotel_name = "Kaani Palm Beach"
        hotel_id = skyscanner.get_hotel_id(hotel_name)
        self.assertEqual(hotel_id, '203822617')

    def test_get_prices_and_links(self):
        hotel_name = "Kaani Palm Beach"
        market = "IN"
        protonvpn.connect_to_protonvpn()
        result = skyscanner.get_prices_and_links(hotel_name, self.checkin_date, self.checkout_date, market=market, hotel_id="203822617")
        self.assertGreater(len(result), 0)


    def test_get_prices_and_links_US(self):
        hotel_name = "Kaani Palm Beach"
        market = "US"
        protonvpn.connect_to_protonvpn()
        result = skyscanner.get_prices_and_links(hotel_name, self.checkin_date, self.checkout_date, market=market, hotel_id="203822617")
        self.assertGreater(len(result), 0)

    
    def test_get_prices_and_links_IL(self):
        hotel_name = "Kaani Palm Beach"
        market = "IL"
        protonvpn.connect_to_protonvpn()
        result = skyscanner.get_prices_and_links(hotel_name, self.checkin_date, self.checkout_date, market=market, hotel_id="203822617")
        self.assertGreater(len(result), 0)

    def test_get_prices_and_links_children(self):
        hotel_name = "Kaani Palm Beach"
        children = "8%2C8"
        protonvpn.connect_to_protonvpn()
        result = skyscanner.get_prices_and_links(hotel_name, self.checkin_date, self.checkout_date, children=children, hotel_id="203822617")
        self.assertGreater(len(result), 0)


    def test_get_prices_and_links_multi_markets(self):
        hotel_name = "Kaani Palm Beach"
        markets = ["IN", "US", "IL"]
        protonvpn.connect_to_protonvpn()
        result_multi = skyscanner.get_prices_and_links_multi_markets(hotel_name, self.checkin_date, self.checkout_date, markets=markets, hotel_id="203822617")
        self.assertGreater(len(result_multi), 0)
        self.assertTrue("IN" in result_multi and "US" in result_multi and "IL" in result_multi)
        self.assertGreater(len(result_multi["IN"]), 0) 
        self.assertGreater(len(result_multi["US"]), 0) 
        self.assertGreater(len(result_multi["IL"]), 0) 


if __name__ == "__main__":
    unittest.main(defaultTest='TestSkyscannerCrawler.test_get_prices_and_links')
