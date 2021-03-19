# CSC1009-DataCrawler
CSC1009 Data Crawler Group Project

# 5. Reddit crawler

The Reddit crawler is a program used to retrieve posts from Reddit based on the subreddit entered. It can also be filtered based on the relevance(hot, top) as well time(day,week,month). After retrieving the posts, it will insert the date, title, and contents of each post into the database.

## 5.1 Prerequisites
---
For Reddit Crawler, there are some libraries needed to start.

1. Install PRAW. Run this command in command prompt

```C
pip install praw
```
2. Install pymongo. Run this command in command prompt

```C
pip install pymongo
```

## 5.2 Functionalities of Reddit Crawler
---
### RedditCrawler.py

#### 1. Importing libraries
```C
from datetime import datetime
import praw
import pymongo
```
The program will need 3 imported libraries. 
> datetime: To convert the value retrieved from the object into date & time.

> praw: The API that will be used to retrieve posts from reddit.

> pymongo: This is needed to establish a connection with MongoDB so that we can insert our Reddit posts.

#### 2. Authentication
Before we start, we need authentication to allow our crawler to roam through reddit and retrieve posts from subreddits. To do this:
1. Create/Login to your reddit account
2. Go and create a Reddit instance [HERE](https://www.reddit.com/prefs/apps)
3. Click on "create another app"

![image](https://user-images.githubusercontent.com/30068705/111768122-7ad99b80-88e2-11eb-90bc-e9c95f6f652e.png)

4. Enter details
```C
a. Fill up the name and description with whatever you want to name it.
b. For redirect uri, enter: http://localhost:8080
c. Click on "create app"
```
![image](https://user-images.githubusercontent.com/30068705/111768936-8bd6dc80-88e3-11eb-967c-2ccf5101ef3b.png)

5. Transfer authentication details to your code
```C
reddit = praw.Reddit(client_id='Enter client_id here', client_secret='Enter secret here', user_agent='Enter user_agent here')
```
![image](https://user-images.githubusercontent.com/30068705/111769789-934ab580-88e4-11eb-96ee-3c83c984aa12.png)

#### 3. Find subreddit function
1. Find the hot 20 posts from Reddit
```C
def find_subreddit_hot(name):
    subrdt = reddit.subreddit(name).hot(limit=20)
    return subrdt
```
2. Find the top 20 posts of the day from Reddit
```C
def find_subreddit_top_day(name):
    subrdt = reddit.subreddit(name).top(time_filter='day', limit=20)
    return subrdt
```
3. Find the top 20 posts of the week from Reddit
```C
def find_subreddit_top_week(name):
    subrdt = reddit.subreddit(name).top(time_filter='week', limit=20)
    return subrdt
```
4. Find the top 20 posts of the month from Reddit
```C
def find_subreddit_top_month(name):
    subrdt = reddit.subreddit(name).top(time_filter='month', limit=20)
    return subrdt
```

These functions allow you to find 20 posts based from the hot or top of the day/week/month page. You can also change the time filters to year or all for the all time top posts. You can also get the newest posts as well depending on what you want. You can research more on PRAW [here](https://praw.readthedocs.io/en/latest/).

#### 4. Add to database function
1.This function allows you insert the date, title and body of the posts into the collection.
```
def add_db(subreddit, col):
    mylist = []
    for post in subreddit:
        doc = {"Date": str(datetime.fromtimestamp(post.created)), "Title": post.title, "Post": post.selftext}
        mylist.append(doc.copy())
    col.insert_many(mylist)
```
By creating an empty list, I will loop the entire list generator and add the date, title, and post into a dictionary and then add that dictionary into the list. The loop will go through all Reddit objects and at the end, I will have the list of all posts containing their date, title and body. This list will then be added into the collection of the database.

#### 5. Calling the functions
Now with the functions assembled. We can finally retrieve the posts and add them into our database.
1. Retrieving the posts
```C
stocks_posts_hot = find_subreddit_hot("Stocks")
stocks_posts_day = find_subreddit_top_day("Stocks")
stocks_posts_week = find_subreddit_top_week("Stocks")
stocks_posts_month = find_subreddit_top_month("Stocks")
```
This will get me the 20 posts from hot, top of day/week/month.

2. 
