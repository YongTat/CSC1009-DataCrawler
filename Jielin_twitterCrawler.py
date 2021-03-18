#Libraries
import tweepy 
import pymongo

screen_names=["amazon", "Apple","AlibabaGroup","Facebook","netflix","GameStop","Google","IBM","Oracle","Tesla"]
stock_names = ["AMZN", "APPL", "BABA", "FB", "NFLX", "GME", "GOOG", "IBM", "ORCL", "TSLA"]

class connectionToMongoDb():
    def __init__(self, login):
        self.login = login

    # Get connection to MongoDb
    def getConnectionToMongoDb(self):
        # Login Variables
        login = []
        with open("config.txt", "r") as f:
            for line in f:
                login.append(line.strip())
        client = pymongo.MongoClient("mongodb+srv://{}:{}@cluster0.vk8mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority".format(login[0],login[1]))
        return client

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
	