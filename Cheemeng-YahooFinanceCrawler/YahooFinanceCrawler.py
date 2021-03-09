import yfinance as yf
import requests
from bs4 import BeautifulSoup 

#Arrays
ccSymbols = []
d = []

#Extract for all Cryptocurrencies 
for i in range(0,400,100):
    #Url of Cyrptocurrencies on YahooFinance
    CryptoCurrenciesUrl = "https://sg.finance.yahoo.com/cryptocurrencies?offset="+str(i)+"&count=100"
    
    #HTTP request to the Url
    r= requests.get(CryptoCurrenciesUrl)

    #Createing BS object and instruct BS to use 'lxml' parser
    data=r.text
    soup=BeautifulSoup(data, 'lxml')

    #Scrap all attributes from table
    for listing in soup.find_all('tr', attrs={'class':'simpTblRow'}):

       #CC Symbol
        for tdSymbol in listing.find_all('td', attrs={'aria-label':'Symbol'}):
            for aSymbol in tdSymbol.find_all('a'):
                ccSymbol = aSymbol.find(text=True)
                #print(ccSymbol)
                ccSymbols.append(str(ccSymbol))


i=0
while i < len(ccSymbols):
    cc = yf.Ticker(str(ccSymbols[i]))
    data = cc.history(period="max")
    data = data[["Open","High","Low","Close","Volume"]]
    data.reset_index(inplace=True)
    data = data.to_dict("records")
    data = list(data)
    # print(ccSymbols[i])
    # print (data)
    
    #print(datas.history(period="max"))
    i+=1

