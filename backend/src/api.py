import sys
sys.path.append('/home/ubuntu/backend')

import src.HotelsService as hotel_service
from flask import Flask, request, jsonify
import pika
import uuid
import json
from decimal import Decimal
from datetime import datetime
from src.Db_helper import DBHelper
from flask_cors import CORS
import urllib.parse

db_helper = DBHelper()

app = Flask(__name__)
CORS(app)

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return super(CustomJSONEncoder, self).default(obj)

class RpcClient:
    def __init__(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        self.channel = self.connection.channel()
        
        # Declare the queue with durable=True
        self.channel.queue_declare(queue='hotel_search_queue', durable=True)
        
        result = self.channel.queue_declare(queue='', exclusive=True)
        self.callback_queue = result.method.queue
        
        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True
        )
        self.response = None
        self.corr_id = None

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, data):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(
            exchange='',
            routing_key='hotel_search_queue',
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
                delivery_mode=2  # Make message persistent
            ),
            body=json.dumps(data, cls=CustomJSONEncoder)
        )
        while self.response is None:
            self.connection.process_data_events()
        return json.loads(self.response)

@app.route('/search', methods=['POST'])
def search_deals():
    data = request.json
    rpc_client = RpcClient()
    try:
        results = rpc_client.call(data)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/hotel', methods=['GET'])
def search_hotel():
    hotel_name = request.args.get('hotel_name')
    
    try:
        results = db_helper.get_hotel_data_by_name(hotel_name)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/deals', methods=['GET'])
def search_user_deals():
    user_id = urllib.parse.quote(request.args.get('user_id'))
    user_role = request.args.get('user_role')
    try:
        results = db_helper.get_user_deals(user_id, user_role)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, ssl_context=('/home/ubuntu/backend/fullchain.pem', '/home/ubuntu/backend/privkey.pem'))
