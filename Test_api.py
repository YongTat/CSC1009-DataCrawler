import unittest
import requests

class ApiTest(unittest.TestCase):
    def test_valid_link(self):
        API_URL = "http://localhost:5000/stocks/GME"
        r = requests.get(API_URL)
        self.assertEqual(r.status_code, 200)
    def test_invalid_link(self):
        API_URL = "http://localhost:5000/meow/GME"
        r = requests.get(API_URL)
        self.assertEqual(r.status_code, 404)

if __name__ == "__main__":
    unittest.main()