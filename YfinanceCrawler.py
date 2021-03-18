#Data crawler libraries
import requests
from bs4 import BeautifulSoup
import yfinance as yf
import validators

#Mongodb Database
import pymongo

# Array
# stockIndustries = [# "energy",
#                     # "financial",
#                     # "healthcare",
#                     # "industrials",
#                     # "diversified_business",
#                     "retailing_hospitality"]

# topStocks = ["AMZN", 
#                 "APPL",
#                 "BABA",
#                 "FB",
#                 "NFLX",
#                 "GME",
#                 "GOOG",
#                 "IBM",
#                 "ORCL",
#                 "TSLA"]

stockSymbol = []

class YFinanceCrawler():
    def __init__(self, symbol):      
        self.currentSymbol = symbol

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

    # Get stock symbols from webpage
    def getSymbol(self, i, soup):
        #Scrap all symbols from table
        for listing in soup.find_all('tr', attrs={'data-reactid':i}):
            #CC Symbol
            for tdSymbol in listing.find_all('td', attrs={'data-reactid':i+1}):
                for aSymbol in tdSymbol.find_all('a'):
                    Symbol = aSymbol.find(text=True)
                    #Add new symbol into array
                    stockSymbol.append(Symbol)
        return stockSymbol

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

        

        