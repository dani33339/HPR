import sys
sys.path.append('/home/ubuntu/backend')

import src.HotelsService as hotel_service
import pika
import json
from decimal import Decimal
from datetime import datetime

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return super(CustomJSONEncoder, self).default(obj)

def on_request(ch, method, props, body):
    data = json.loads(body)
    
    hotel_name = data.get('hotel_name')
    checkin_date = data.get('checkin_date')
    checkout_date = data.get('checkout_date')
    adults = data.get('adults', 2)
    no_rooms = data.get('no_rooms', 1)
    children = data.get('children', "")
    user_id = data.get('user_id', "guest")
    user_role = data.get('user_role', "")

    response = {}
    try:
        results = hotel_service.search(hotel_name, checkin_date, checkout_date, adults, no_rooms, children, user_id, user_role)
        response = results
    except Exception as e:
        response = {"error": str(e)}

    ch.basic_publish(
        exchange='',
        routing_key=props.reply_to,
        properties=pika.BasicProperties(correlation_id=props.correlation_id),
        body=json.dumps(response, cls=CustomJSONEncoder)
    )
    ch.basic_ack(delivery_tag=method.delivery_tag)

parameters = pika.ConnectionParameters(host='localhost', heartbeat=240)
connection = pika.BlockingConnection(parameters)
channel = connection.channel()

# Declare the queue with durable=True
channel.queue_declare(queue='hotel_search_queue', durable=True)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='hotel_search_queue', on_message_callback=on_request)

print(" [x] Awaiting RPC requests")
channel.start_consuming()
