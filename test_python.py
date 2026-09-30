import unittest
from send import booking_message
class PayloadTest(unittest.TestCase):
 def test_payload(self):
  p=booking_message('from@example.com','to@example.com')
  self.assertEqual(p['to'],['to@example.com'])
  self.assertTrue(p['text'])
