import unittest
from unittest.mock import patch, mock_open
import json
import src.currency_helper as currency_helper

class TestCurrencyHelper(unittest.TestCase):
    
    @patch('src.currency_helper.requests.get')
    def test_call_endpoint_success(self, mock_get):
        mock_response = unittest.mock.Mock()
        expected_data = {
            'data': {
                'INR': 74.23,
                'ILS': 3.26
            }
        }
        mock_response.json.return_value = expected_data
        mock_response.status_code = 200
        mock_get.return_value = mock_response

        rates = currency_helper.call_endpoint()
        self.assertEqual(rates, expected_data['data'])
    
    @patch('src.currency_helper.requests.get')
    def test_call_endpoint_failure(self, mock_get):
        mock_response = unittest.mock.Mock()
        mock_response.json.return_value = {'message': 'Invalid API key'}
        mock_response.status_code = 403
        mock_get.return_value = mock_response

        rates = currency_helper.call_endpoint()
        self.assertIsNone(rates)

    @patch('src.currency_helper.time.time', return_value=2000000)
    @patch('src.currency_helper.os.path.exists', return_value=True)
    @patch('src.currency_helper.os.path.getmtime', return_value=0)
    @patch('builtins.open', new_callable=mock_open)
    @patch('src.currency_helper.call_endpoint')
    def test_get_exchange_rate_with_old_file(self, mock_call_endpoint, mock_open, mock_getmtime, mock_exists, mock_time):
        mock_call_endpoint.return_value = {'INR': 75.0, 'ILS': 3.3}
        handle = mock_open.return_value.__enter__.return_value
        handle.read.return_value = json.dumps({'INR': 74.23, 'ILS': 3.26})

        rate = currency_helper.get_exchange_rate('INR')
        self.assertEqual(rate, 75.0)
    
    @patch('src.currency_helper.time.time', return_value=2000000)
    @patch('src.currency_helper.os.path.exists', return_value=True)
    @patch('src.currency_helper.os.path.getmtime', return_value=1000000)
    @patch('builtins.open', new_callable=mock_open, read_data=json.dumps({'INR': 74.23, 'ILS': 3.26}))
    def test_get_exchange_rate_currency_not_found(self, mock_open, mock_getmtime, mock_exists, mock_time):
        rate = currency_helper.get_exchange_rate('USD')
        self.assertIsNone(rate)

if __name__ == '__main__':
    unittest.main()
