# CSC1009-DataCrawler
CSC1009 Data Crawler Group Project

# 3. Yahoo Finance crawler

Yahoo Finance Crawler is a program that will automatically search stocks on Yahoo Finance. It will crawl historical data for specific stocks from yahoo finance website. Other than that, It also can crawl based on stocks in different areas of industries. This crawler will also automatically create new stock in the database when it has new stock. After crawling historical data, the program will store these data into the MongoDb database automatically.

## 3.1 Prerequisites
---
For Yahoo Finance Crawler, there are some prerequisites to do/run to allow the crawler to function correctly.

1. Install requests library. Run this command in your terminal

```C
pip install requests
```

2. Install beautifulsoup4 library. Run this command in your terminal

```C
pip install beautifulsoup4
```

3. Install yfinance library. Run this command in your terminal
 
```C
pip install yfinance
```

4. Install pymongo library. Run this command in your terminal

```C
pip install pymongo
```

## 3.2 Functionalities of Yahoo Finance Crawler

### Cheemeng_yFinanceCrawler.py

#### 1. Importing libraries
```C
import requests
from bs4 import BeautifulSoup
import yfinance as yf
import validators
```
The program will be importing libraries which are requests, BeautifulSoup, yfinance, pymongo. Installation guide for these libraries are shown in 2.3.1 Prerequisites

Firstly, the program will import requests library to allow programs to send HTTP requests. This module will return a response object with all the response data. 

Secondly, the program will import BeautifulSoup from bs4. The use of BeautifulSoup allows the program to pull data out from HTML and XML files. The parser also will provide idiomatic ways of navigating, searching and modifying the parse tree

Thirdly, the program will import yfinance as yf. This library allows the program to send requests and receive results from Yahoo Finance API.

Lastly, the program will import pymongo. This library provide tools for program to interact with MongoDB

#### 2. YFinanceCrawler class
```C
class YFinanceCrawler():
    def __init__(self, symbol):      
        self.currentSymbol = symbol
```
Main program will create an class object to by passing a parameter call *symbol* into *self.currentSymbol*

##### 2.1 Crawl Historical data function
```C
    # Crawl historical data                    
    def getHistoricalData(self):
            print(self.currentSymbol)
            stock = yf.Ticker(self.currentSymbol)
            data = stock.history(period="max")
            data = data[["Open","High","Low","Close","Volume"]]
            data.reset_index(inplace=True)
            data = data.to_dict("records")
            data = list(data)

            # Check if data is in correct datatype
            i = 0
            while i < len(data):
                openValue = data[i]["Open"] #float
                openRes = isinstance(openValue, str)

                highValue = data[i]["High"] #float
                highRes = isinstance(highValue, str)

                lowValue = data[i]["Low"] #float
                lowRes = isinstance(lowValue, str)
                
                closeValue = data[i]["Close"] #float
                closeRes = isinstance(closeValue, str)

                volumeValue = data[i]["Volume"] #int
                volumeRes = isinstance(volumeValue, str)

                # Open value must be in float
                # If value is a string(true)
                if str(openRes) == "True":
                    openValue = 0.0
                # If value if not float
                elif type(openValue) != float:
                    print("Open: Value must be in float type")
                    openValue = float(openValue)
                
                # High value must be in float
                # If value is a string(true)
                if str(highRes) == "True":
                    highValue = 0.0
                # If value is not float
                elif type(highValue) != float:
                    print("High: Value must be in float type")
                    highValue = float(highValue)

                # Low value must be in float
                #If value is a string(true)
                if str(lowRes) == "True":
                    lowValue = 0.0
                # If value is not float
                elif type(lowValue) != float:
                    print("Low: Value must be in float type")
                    lowValue = float(lowValue)

                # Close value must be in float
                # If value is string(true)
                if str(closeRes) == "True":
                    closeValue = 0.0
                # If value is not float
                elif type(closeValue) != float:
                    print("Close: Value must be in float type")
                    closeValue = float(closeValue)
                
                i += 1

            return data
```
This method is to crawl historical data for stocks from Yahoo Finance.

Firstly, it will access the Ticker module which allows us to get ticker data. After that, we will set the period and what kind of value we want for historical data. 

After the program recieved historical data, the program will check if the values are in the correct datatype. If not, it will prompt message and convert the incorrect datatype into a correct datatype.

Lastly, we will return the historical data for current stock in a list.

##### 2.2 Get Parser function by using BeautifulSoup
```C
    # Using beautiful soup to create parser
    def getParser(self, url):
        #Check if baseUrl is a valid Url
        validUrl = validators.url(url)
        #If is a valid url
        if validUrl == True:
            #HTTP request to the Url
            r= requests.get(url)
            try:
                if r.status_code == 404:
                    raise Exception("HTTP URL not found")
            except Exception:
                print("Page not found")

            finally:
                #Creating BS object and instruct BS to use 'lxml' parser
                data=r.text
                soup=BeautifulSoup(data, 'lxml')
                return soup
        #If is invalid url
        else:
            print("Invalid url")
```
This method will take in url parameter from main program. The program will check if is a valid url. 
If the url is valid, it will send an HTTP request.

If is a invalid url, it will prompt "Invalid url" message.

After receiving the response object, it will instruct BeautifulSoup to use the lxml parser and create a BeautifulSoup object by using BeautifulSoup library.

##### 2.3 Crawl stocks name from Yahoo Finance
```C
    #Scrap all symbols from table
    for listing in soup.find_all('tr', attrs={'data-reactid':i}):
        #CC Symbol
        for tdSymbol in listing.find_all('td', attrs={'data-reactid':i+1}):
            for aSymbol in tdSymbol.find_all('a'):
                Symbol = aSymbol.find(text=True)
                #Add new symbol into array
                stockSymbol.append(Symbol)
    return stockSymbol
```
In this function, we will be searching the table which contains stocks symbols and scrap stocks symbols from the Yahoo Finance webpage by using the BeautifulSoup object. Everytime we find a stock symbol, we will insert the symbol into an array.

##### 2.4 Crawl historical data of Industries/Areas stocks 
```C
    def getIndustriesStockData(self, db):
        url = "https://sg.finance.yahoo.com/industries/" + self.currentSymbol
        for i in range(55,250,20):

            #Url of stock on YahooFinance            
            # Get BS object by requesting url
            soup = self.getParser(url)
            
            #get symbol for stock
            stockSymbol = self.getSymbol(i, soup)
            print(stockSymbol)

        #Crawl historical data for all stocks from yahoo finance
        i = 0
        while i < len(stockSymbol):
            try:
                if stockSymbol[i] not in existing_list:
                    raise Exception("Stock Not Found")
            except Exception:
                # create new collection
                print("Creating New Collection")
                currentStockSymbol = str(stockSymbol[i])
                new_collection = db[currentStockSymbol]
                callCrawlHistoricalData = YFinanceCrawler(currentStockSymbol)
                data = callCrawlHistoricalData.getHistoricalData()
                
                if len(data) != 0:
                    # fetch and insert data
                    new_collection.insert_many(data)
                else:
                    print("No Historical data")
            i += 1
```
In this function, we will crawl stock symbols from different industries depends on which industry that user want. In order to do that, we will be creating a BeautifulSoup object by sending HTTP requests to the Yahoo Finance website. After the object is created, we will start scraping the stock symbols from the website.
Then, we will check if the current stock is existing in the database. If current stock is not in the database, we will be creating a new collection and adding into the database. After that , the program will crawl historical data for current stock and add into the current collection. If there is no historical data for current stock, the program will print no historical data.


### Cheemeng_YF_UnitTesting.py
#### Unit Testing for Yahoo Finance Crawler