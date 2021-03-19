# 4. Twitter Crawler

Twitter crawler is a program that can crawl user's tweets from their user timeline. After the tweets are retrieved from the user's timeline, it will store the tweet and the date it is created into the respective database, represented by their stock name into mongodb.

## 4.1 Prerequisites

1. Install tweepy library. Run this command in command prompt.
```
pip install tweepy
```
Tweepy is a Python library to access the Twitter API which will be used to retrieve tweets from Twitter. Tweepy includes a set of classes and methods that represent Twitter’s models and API endpoints, and it handles implementation details.

2. Install pymongo. Run this command in command prompt.
```
pip install pymongo
```
Pymongo library is a Python Driver for MongoDB and is used to interact with MongoDB database from Python.


## 4.2 Functionalitiy of Twitter Crawler

### 1. Importing libraries
```
import tweepy 
import pymongo
```

### 2. Funtion to crawl tweets

Tweepy uses OAuth to to authenticate the request, therefore we need to create the authentication credentials using the Twitter Developer Account. The four credentials are consumer key, consumer secret key, access key and access secret key.

The function will run and get the twitter credentials that was generated from the twitter developer account and saved into api.txt file. Next, we used OAuthHandler to set the credentials to be used in all API calls and API to access the Twitter API's functionality.

We will be retrieving tweets from Twitter accounts owned by the stocks we want to monitor using user_timeline. We will firstly make intial request to get the most recent of the twitter account and save the most recent tweets to a list. Then, the function will check whether the account has tweets, if the account doesn not have tweets, it will return a empty list. If the account has tweets, it will save the id of the oldest tweet less one and use it in the user_timeline max_id parameter to prevent duplicate tweets. We can also filter if we want to include replies of the twitter account using exclude_replies parameter.

```
class crawlTweets():
    def __init__(self,username):
        self.username = username

    def get_all_tweets(self):
        
        #Twitter API credentials
        api=[]
        with open("api.txt", "r") as f:
            for line in f:
                api.append(line.strip())
        consumer_key = api[0]
        consumer_secret = api[1]
        access_key = api[2]
        access_secret = api[3]

       #authorize twitter, initialize tweepy
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_key, access_secret)
        api = tweepy.API(auth)

        #initialize a list to hold all the tweepy Tweets
        alltweets = []                                                                                                                          

        #make initial request for most recent tweets 
        new_tweets = api.user_timeline(screen_name = self.username,count=200,exclude_replies=True)
        #save most recent tweets
        alltweets.extend(new_tweets)

        #to check if the user has tweets
        if len(alltweets) == 0:
            return alltweets
        else:    
            #save the id of the oldest tweet less one
            oldest = alltweets[-1].id - 1

            #keep grabbing tweets until there are no tweets left to grab
            while len(new_tweets) > 0:
                #all subsiquent requests use the max_id param to prevent duplicates
                new_tweets = api.user_timeline(screen_name = self.username,count=200,max_id=oldest,exclude_replies=True)
                alltweets.extend(new_tweets)
                #update the id of the oldest tweet less one
                oldest = alltweets[-1].id - 1

        return alltweets
```


### 3. Main funtion 
In Main, we will first login to MongoDB using connectiontoMongoDb function and connect to the databse called "twitter". We will be saving the tweets of each account in the databse using their stock symbol. For example, for "amazon" screen name, it will be saved as "AMZN" into the database.
Then, we will check if the name of the stock is in the database, if there is no collection of the current stock, it will create a new collection and add it to the database. After the collection is created, it will run the crawlTweets function to retrieve tweets from the accounts and add it into the collection. If there is no tweets for the current account, it will print no historical data.

```
def main():
    login = []
    connectToMongoDb = connectionToMongoDb(login)
    client = connectToMongoDb.getConnectionToMongoDb()
    db = client["twitter"]
    existing_list = db.list_collection_names()

    count = 0
    while count < len(stock_names):
        try:
            if stock_names[count] not in existing_list:
                raise Exception("Account Not Found")
        except Exception:
            # create new collection
            print("Creating New Collection")
            current_screenname = str(screen_names[count])
            current_stockname = str(stock_names[count])
            print(current_stockname)
            new_collection = db[current_stockname]
            callCrawlHistoricalData = crawlTweets(current_screenname)
            data = callCrawlHistoricalData.get_all_tweets()
            
            if len(data) != 0:
                    #insert data into collections
                    for tweet in data:
                        new_collection.insert_one({
                        "tweet_text": tweet.text,
                        "tweet_created": tweet.created_at})
            else:
                print("No Historical data")     
        count+=1
	
if __name__ == "__main__":
    main()
	
```
