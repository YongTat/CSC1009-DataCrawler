#Data crawler libraries
import requests
from bs4 import BeautifulSoup 
import pandas as pd
import scrapy
import json

#MongoDB libraries
from pymongo import MongoClient

#Arrays
ccNames=[]
ccPrices=[]
ccChanges=[]
ccPercentChanges=[]
ccMarketCaps=[]
ccTotalVolumes=[]
ccCirculatingSupplys=[]
ccSymbols =[]
 
#Extract values for all Cryptocurrencies
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

        #CC Name
        for name in listing.find_all('td', attrs={'aria-label':'Name'}):
            ccNames.append(name.text)
        #CC Price
        for price in listing.find_all('td', attrs={'aria-label':'Price (intraday)'}):
            ccPrices.append(price.find('span').text)
        #CC Change
        for change in listing.find_all('td', attrs={'aria-label':'Change'}):
            ccChanges.append(change.text)
        #CC Change(%)
        for percentChange in listing.find_all('td', attrs={'aria-label':'% change'}):
            ccPercentChanges.append(percentChange.text)
        #CC MarketCap
        for marketCap in listing.find_all('td', attrs={'aria-label':'Market cap'}):
            ccMarketCaps.append(marketCap.text)
        #CC Total Volume all currencies
        for totalVolume in listing.find_all('td', attrs={'aria-label':'Total volume all currencies (24 hrs)'}):
            ccTotalVolumes.append(totalVolume.text)
        #CC Circulating Supply
        for circulatingSupply in listing.find_all('td', attrs={'aria-label':'Circulating supply'}):
            ccCirculatingSupplys.append(circulatingSupply.text)
        #CC Symbol
        for tdSymbol in listing.find_all('td', attrs={'aria-label':'Symbol'}):
            for aSymbol in tdSymbol.find_all('a'):
                ccSymbol = aSymbol.find(text=True)
                ccSymbols.append(str(ccSymbol))
                #ccLinks.append("https://sg.finance.yahoo.com/quote/"+str(ccSymbol)+"/history?p=interval=1d&filter=history&frequency=1d&includeAdjustedClose=true")

#Extract historical data for each CC by using Symbol
iccSymbol = 0   
while iccSymbol < len(ccSymbols):
    #Url of Historical data for each Cyrptocurrencies on YahooFinance
    CurrentCCUrl = "https://sg.finance.yahoo.com/quote/"+str(ccSymbols[iccSymbol]) +"/history?p=interval=1d&filter=history&frequency=1d&includeAdjustedClose=true"
  
    #HTTP request to the Url
    CurrentCCr= requests.get(CurrentCCUrl)
    
    #Createing BS object and instruct BS to use 'lxml' parser
    CurentCCdata=CurrentCCr.text
    CurrentCCSoup=BeautifulSoup(CurentCCdata, 'lxml')

    #Find Historical table from html
    HistoricalData_table = CurrentCCSoup.find("table", attrs={"data-test":"historical-prices"})
    
    #If there is no historical data
    if HistoricalData_table is None:
        print("No Historical data")
        iccSymbol +=1
    else:
        #Find all row from the Historical table
        HistoricalData_data = HistoricalData_table.tbody.find_all("tr")
        
        # Get all the headings of Lists
        datas = []
        for tr in HistoricalData_table.tbody.find_all("tr"):
            for td in tr.find_all("td"):
                #datas.append(ccSymbols[iccSymbol],td.text)
                datas.append(td.text)
            print(CurrentCCUrl)
            print(datas)
        iccSymbol += 1

    
    # Json
    

# for i in ccLinks:
#     print(i, end='')
#     print()

# df = pd.read_html(str(HistoricalData_table))
# print(ccSymbols[iccSymbol])
# print(df[0].to_json(orient='records'))