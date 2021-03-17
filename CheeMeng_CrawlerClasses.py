#Data crawler libraries
import requests
from bs4 import BeautifulSoup
import yfinance as yf

#Mongodb Database
import pymongo

# Array
stockIndustries = ["energy",
                    # "financial",
                    # "healthcare",
                    # "industrials",
                    # "diversified_business",
                    "retailing_hospitality"]

topStocks = ["AMZN", 
                "APPL",
                "BABA",
                "FB",
                "NFLX",
                "GME",
                "GOOG",
                "IBM",
                "ORCL",
                "TSLA"]

stockSymbol = []


############ Create Beautiful Soup Parser/Object ###########
class getIndustries():
    # Set Base url
    def __init__(self, industry):
        self.baseUrl =  "https://sg.finance.yahoo.com/industries/" + industry

class createParser(getIndustries):
    # Using beautiful soup to create parser
    def getParser(self):
        #HTTP request to the Url
        r= requests.get(self.baseUrl)
        #Creating BS object and instruct BS to use 'lxml' parser
        data=r.text
        soup=BeautifulSoup(data, 'lxml')
        return soup



############ Crawl Historical Data from Yahoo Finance ###########
class setSymbol():
    def __init__(self,symbol):
        self.currentSymbol = symbol

# Derived Class for Yahoo Finance Crawler
class crawlHistoricalData(setSymbol):
    # Crawl historical data                    
    def getHistoricalData(self):
            print(self.currentSymbol)
            stock = yf.Ticker(self.currentSymbol)
            data = stock.history(period="max")
            data = data[["Open","High","Low","Close","Volume"]]
            data.reset_index(inplace=True)
            data = data.to_dict("records")
            data = list(data)
            return data



############ Use Beautiful soup parser ###########
############ Crawl stocks from Yahoo Finance ###########
class crawlSymbol():
    def __init__(self, i, soup):
        self.i = i
        self.soup = soup

    # Get stock symbols from webpage
    def getSymbol(self):
        #Scrap all symbols from table
        for listing in self.soup.find_all('tr', attrs={'data-reactid':self.i}):
            #CC Symbol
            for tdSymbol in listing.find_all('td', attrs={'data-reactid':self.i+1}):
                for aSymbol in tdSymbol.find_all('a'):
                    Symbol = aSymbol.find(text=True)
                    #Add new symbol into array
                    stockSymbol.append(Symbol)
        return stockSymbol



############ connection to MongoDb ###########
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
        client = pymongo.MongoClient("mongodb+srv://{}:{}@cluster0.vk8mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority".format(login[0],login[1]))

        # Connect to stocks database
        db = client[self.database]        
        print(self.database)
        return db


############ Methods ###########
############ Crawl Top Stock ###########
def crawlTopStock(db, existing_list):
    iTopStock = 0
    while iTopStock < len(topStocks):
        try:
            if topStocks[iTopStock] not in existing_list:
                raise Exception("Stock Not Found")
        except Exception:
            # create new collection
            print("Creating New Collection")
            currentStock = str(topStocks[iTopStock])
            new_collection = db[currentStock]
            SymbolObject = crawlHistoricalData(currentStock)
            data = SymbolObject.getHistoricalData()
            
            if len(data) != 0:
                # fetch and insert data
                new_collection.insert_many(data)
            else:
                print("No Historical data")
        iTopStock+=1



############ Crawl Stocks by different industries ###########
def crawlIndustryStocks(db, existing_list):
    #Check if have new stock on Yahoo Finance 
    iIndustries = 0
    while iIndustries < len(stockIndustries):

        for i in range(55,250,20):

            #Url of stock on YahooFinance
            industriesObject = createParser(stockIndustries[iIndustries])
            
            # Get BS object by requesting url
            soup = industriesObject.getParser()
            
            #get symbol for stock
            callCrawlSymbol = crawlSymbol(i, soup)
            stockSymbol = callCrawlSymbol.getSymbol()
            print(stockSymbol)
        iIndustries += 1

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
            callCrawlHistoricalData = crawlHistoricalData(currentStockSymbol)
            data = callCrawlHistoricalData.getHistoricalData()
            
            if len(data) != 0:
                # fetch and insert data
                new_collection.insert_many(data)
            else:
                print("No Historical data")
        i+=1
