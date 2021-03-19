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
