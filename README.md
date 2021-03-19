# CSC1009-DataCrawler
CSC1009 Data Crawler Group Project

# 5. Reddit crawler

The Reddit crawler is a program used to retrieve posts from Reddit based on the subreddit entered. It can also be filtered based on the relevance(hot, top) as well time(day,week,month). After retrieving the posts, it will insert the date, title, and contents of each post into the database.

## 5.1 Prerequisites
---
For Yahoo Finance Crawler, there are some prerequisites to do/run to allow the crawler to function correctly.

1. Install requests library. Run this command in command prompt

```C
pip install praw
```
4. Install pymongo library. Run this command in command prompt

```C
pip install pymongo
```

## 3.2 Functionalities of Reddit Crawler
---
### Cheemeng_yFinanceCrawler.py

#### 1. Importing libraries
```C
import requests
from bs4 import BeautifulSoup
import yfinance as yf
import validators
```
