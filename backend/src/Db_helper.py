import sys
sys.path.append('/home/ubuntu/backend')

import logging
from datetime import datetime, date

from src.Db import Db

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


class DBHelper:

    def __init__(self):
        self.db = Db()

    def get_hotels(self):
        query = "SELECT * FROM hotels"
        return self.db.execute_query(query)
    
    def get_search_request(self, sr_id):
        query = "SELECT * " \
                "FROM search_requests " \
                "WHERE sr_id = %s" \
                % (sr_id)
                
            
        result = self.db.execute_query(query)
        return result
    
    def get_deals_for_sr(self, sr_id):
        query = "SELECT * FROM deals WHERE sr_id = %s" 
        params = (sr_id,)
        result = self.db.execute_query(query, params)
        return result
    
    def get_hotel_data_by_name(self, hotel_name):
        query = "SELECT * FROM hotels WHERE name = %s"
        params = (hotel_name,)
        result = self.db.execute_query(query, params)
        if result:
            return result[0]
        return None  
    
    def append_hotel_data(self, hotel_data):
        query = """
            INSERT INTO hotels (name, rating, image_url, address)
            VALUES (%s, %s, %s, %s)
        """
        params = (
            hotel_data.get('name'),
            hotel_data.get('rating'),
            hotel_data.get('image_url'),
            hotel_data.get('address'),
        )

        self.db.execute_insert(query, params)

    def append_skyscanner_id(self, hotel_name, skyscanner_id, stars):
        query = """
            UPDATE hotels
            SET skyscanner_id = %s, stars = %s
            WHERE name = %s
        """
        params = (
            skyscanner_id,
            stars,
            hotel_name
        )

        self.db.execute_insert(query, params)

    def append_trivago_id(self, hotel_name, trivago_id):
        query = """
            UPDATE hotels
            SET trivago_id = %s
            WHERE name = %s
        """
        params = (
            trivago_id,
            hotel_name
        )

        self.db.execute_insert(query, params)

    def append_momondo_id(self, hotel_name, momondo_id):
        query = """
            UPDATE hotels
            SET momondo_id = %s
            WHERE name = %s
        """
        params = (
            momondo_id,
            hotel_name
        )

        self.db.execute_insert(query, params)
    
    def insert_deals(self, deals, sr_id, channel):
        for deal in deals:
            self.insert_deal(deal, sr_id, channel)

    def insert_deal(self, deal, sr_id, channel):
        query = """
            INSERT INTO deals (sr_id, channel, partner, price, url, ts)
            VALUES (%s, %s, %s, %s, %s, now())
        """
        params = (
            sr_id,
            channel,
            deal.get('partner'),
            deal.get('price'),
            deal.get('url'),
        )

        self.db.execute_insert(query, params)

    def create_search_request(self,hotel_name, checkin_date, checkout_date, group_adults, no_rooms, children_ages, sr_id, user_id):
        query = """
            INSERT INTO search_requests (name, checkin_date, checkout_date, group_adults, no_rooms, children_ages, sr_id, ts, user_id)
            VALUES (%s, %s, %s, %s, %s, %s , %s, now(), %s)
        """
        params = (
            hotel_name,
            checkin_date,
            checkout_date,
            group_adults,
            no_rooms,
            children_ages,
            sr_id,
            user_id
        )

        self.db.execute_insert(query, params)

    def get_cache_deals(self, hotel_name, checkin_date, checkout_date, group_adults, no_rooms, children_ages, channel=None):
        query = """
            SELECT * 
            FROM deals 
            WHERE sr_id IN (
                SELECT sr_id 
                FROM search_requests 
                WHERE name = %s 
                AND checkin_date = %s 
                AND checkout_date = %s 
                AND group_adults = %s 
                AND no_rooms = %s 
                AND children_ages = %s
                AND ts > DATE_SUB(NOW(), INTERVAL 1 DAY)
            )
        """
        
        params = [
            hotel_name,
            checkin_date,
            checkout_date,
            group_adults,
            no_rooms,
            children_ages
        ]
        
        if channel is not None:
            query += " AND channel = %s"
            params.append(channel)

        return self.db.execute_query(query, tuple(params))

    def get_user_deals(self, user_id, user_role):
        self.db.connect()
        query = "SELECT * FROM search_requests WHERE user_id = %s AND ts > DATE_SUB(NOW(), INTERVAL 1 DAY)"
        params = (user_id,)
        results = self.db.execute_query(query, params)
        final_list = {}
        for result in results:
            skyscanner_deals = []
            trivago_deals = []
            google_deals = []
            momondo_deals = []
            skyscanner_deals = self.get_cache_deals(result["name"], result["checkin_date"], result["checkout_date"], result["group_adults"], result["no_rooms"], result["children_ages"], channel="skyscanner")
            if user_role == "vip":
                trivago_deals = self.get_cache_deals(result["name"], result["checkin_date"], result["checkout_date"], result["group_adults"], result["no_rooms"], result["children_ages"], channel="trivago")
                google_deals = self.get_cache_deals(result["name"], result["checkin_date"], result["checkout_date"], result["group_adults"], result["no_rooms"], result["children_ages"], channel="google")
                momondo_deals = self.get_cache_deals(result["name"], result["checkin_date"], result["checkout_date"], result["group_adults"], result["no_rooms"], result["children_ages"], channel="momondo")

            result_dict = {}
            result_dict["skyscanner_deals"] = skyscanner_deals
            result_dict["trivago_deals"] = trivago_deals
            result_dict["google_deals"] = google_deals
            result_dict["momondo_deals"] = momondo_deals
            result_dict["hotel_data"] = self.get_hotel_data_by_name(result["name"])
            result_key = (
                result["name"] + " " + 
                result['checkin_date'].strftime('%Y-%m-%d') + "-" + 
                result["checkout_date"].strftime('%Y-%m-%d')
                        )
            if any(deal_list for deal_list in [skyscanner_deals, trivago_deals, google_deals, momondo_deals]):
                final_list[result_key] = result_dict
        return final_list


        