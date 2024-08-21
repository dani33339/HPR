import sys
sys.path.append('/home/ubuntu/backend')

import unittest
import time
import os

# Mock environment variables for testing
os.environ['VPN_USERNAME'] = 'test_username'
os.environ['VPN_PASSWORD'] = 'test_password'

# Import the functions to be tested
import src.protonvpn as protonvpn

class TestProtonVPN(unittest.TestCase):

    def test_connect_to_protonvpn(self):
        protonvpn.connect_to_protonvpn()
        self.assertTrue(protonvpn.check_status())

    def test_connect_to_india(self):
        protonvpn.connect_to_india()
        self.assertTrue(protonvpn.check_status())
        self.assertTrue(protonvpn.check_status_IN)

    def test_disconnect(self):
        protonvpn.connect_to_protonvpn()
        protonvpn.disconnect()
        time.sleep(2)
        self.assertFalse(protonvpn.check_status())

if __name__ == '__main__':
    unittest.main()
