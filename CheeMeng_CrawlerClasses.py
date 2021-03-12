#Data crawler libraries
import requests
from bs4 import BeautifulSoup
import yfinance as yf

#Mongodb Database
import pymongo

# Array
stockSymbol = []

class beautifulSoup():
    def __init__(self, url):
        self.url = url

    #Functions
    # Using beautiful soup to create parser
    def getsSoup(self):
        #HTTP request to the Url
        r= requests.get(self.url)

        #Creating BS object and instruct BS to use 'lxml' parser
        data=r.text
        soup=BeautifulSoup(data, 'lxml')
        return soup

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

class crawlHistoricalData():
    def __init__(self, symbol):
        self.symbol = symbol

    # Crawl historical data                    
    def getHistoricalData(self):
            print(self.symbol)
            stock = yf.Ticker(self.symbol)
            data = stock.history(period="max")
            data = data[["Open","High","Low","Close","Volume"]]
            data.reset_index(inplace=True)
            data = data.to_dict("records")
            data = list(data)
            return data

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

