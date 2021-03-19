# CSC1009-DataCrawler
CSC1009 Data Crawler Group Project

# 5. Reddit crawler

Yahoo Finance Crawler is a program that will automatically search stocks on Yahoo Finance. It will crawl historical data for specific stocks from yahoo finance website. Other than that, It also can crawl based on stocks in different areas of industries. This crawler will also automatically create new stock in the database when it has new stock. After crawling historical data, the program will store these data into the MongoDb database automatically.

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

## 3.2 Functionalities of Yahoo Finance Crawler
---
### Cheemeng_yFinanceCrawler.py

#### 1. Importing libraries
```C
import requests
from bs4 import BeautifulSoup
import yfinance as yf
import validators
```
