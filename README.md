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
```C
reddit = praw.Reddit(client_id='Enter 'client_id' here',
                     client_secret='Enter 'secret' here', user_agent='Enter 'user_agent' here')
```
Before we start, we need authentication to allow our crawler to roam through reddit and retrieve posts from subreddits. To do this:
1. Create/Login to your reddit account
2. Go and create a Reddit instance [HERE](https://www.reddit.com/prefs/apps)
3. Click on "create another app"

![image](https://user-images.githubusercontent.com/30068705/111768122-7ad99b80-88e2-11eb-90bc-e9c95f6f652e.png)

4. Enter details
```C
Fill up the name and description with what you want(Ex. Name: RedditCrawler, Description: Testing)
For redirect uri, enter: http://localhost:8080
```
![image](https://user-images.githubusercontent.com/30068705/111768936-8bd6dc80-88e3-11eb-967c-2ccf5101ef3b.png)


