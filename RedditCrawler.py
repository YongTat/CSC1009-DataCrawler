from datetime import datetime
import praw
import pymongo


class getDatabaseName():
    def __init__(self, database):
        self.database = database


class connectionToMongoDB(getDatabaseName):
    # Get connection to MongoDb
    def getCurrentDb(self):
        # Login Variables
        login = []
        with open("config.txt", "r") as f:
            for line in f:
                login.append(line.strip())
        client = pymongo.MongoClient(
            "mongodb+srv://{}:{}@cluster0.vk8mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority".format(
                login[0], login[1]))

        # Connect to reddit database
        db = client[self.database]
        return db


# Authentication to crawl reddit using API
reddit = praw.Reddit(client_id='AL7dQq3EfLLhzg',
                     client_secret='kwwlC_AHZpTFRG6Fe_zktdjCezczjQ', user_agent='Reddit Crawling')


# Function to get the top 20 hot posts from subreddit
def find_subreddit_hot(name):
    subrdt = reddit.subreddit(name).hot(limit=20)
    return subrdt


# Function to get the top 20 top posts of the day
def find_subreddit_top_day(name):
    subrdt = reddit.subreddit(name).top(time_filter='day', limit=20)
    return subrdt


# Function to get the top 20 top posts of the week
def find_subreddit_top_week(name):
    subrdt = reddit.subreddit(name).top(time_filter='week', limit=20)
    return subrdt


# Function to get the top 20 top posts of the month
def find_subreddit_top_month(name):
    subrdt = reddit.subreddit(name).top(time_filter='month', limit=20)
    return subrdt


# Function to add data into database
def add_db(subreddit, col):
    mylist = []
    for post in subreddit:
        doc = {"Date": str(datetime.fromtimestamp(post.created)), "Title": post.title, "Post": post.selftext}
        mylist.append(doc.copy())
    col.insert_many(mylist)


# Get hot, top of the day, week, month posts from 'Stocks'
stocks_posts_hot = find_subreddit_hot("Stocks")
stocks_posts_day = find_subreddit_top_day("Stocks")
stocks_posts_week = find_subreddit_top_week("Stocks")
stocks_posts_month = find_subreddit_top_month("Stocks")

# Create connect to MongoDB
client = connectionToMongoDB("reddit")
client = client.getCurrentDb()

# Create database
db = client["reddit"]

# Create collections
S_Col_hot = db["Stocks_hot"]
S_Col_top_day = db["Stocks_day"]
S_Col_top_week = db["Stocks_week"]
S_Col_top_month = db["Stocks_month"]

# Add into database
add_db(stocks_posts_hot, S_Col_hot)
add_db(stocks_posts_day, S_Col_top_day)
add_db(stocks_posts_week, S_Col_top_week)
add_db(stocks_posts_month, S_Col_top_month)