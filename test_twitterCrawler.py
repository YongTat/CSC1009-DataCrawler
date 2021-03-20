import unittest
import twittercrawler as tw

valid = ["amazon"]
result_true = tw.crawlTweets(valid)

class Testusername(unittest.TestCase):
    
        
    def test_caps(self):
        invalid_1 = ["AMAZON"]
        result_false1 = tw.crawlTweets(invalid_1)
        self.assertEqual(result_true,result_false1)

    def test_normal(self):
        invalid_2 = ["Amazon"]
        result_false2 = tw.crawlTweets(invalid_2)
        self.assertEqual(result_true,result_false2)
         

if __name__ == '__main__':
    unittest.main()