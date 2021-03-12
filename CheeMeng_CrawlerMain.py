from CheeMeng_CrawlerClasses import beautifulSoup, crawlSymbol, crawlHistoricalData,connectionToMongoDb

# Array
stockIndustries = ["energy",
                    # "financial",
                    # "healthcare",
                    # "business_services",
                    # "telecom_utilities",
                    # "hardware_electronics",
                    # "software_services",
                    # "manufacturing_materials",
                    # "consumer_products_media",
                    # "industrials",
                    # "diversified_business",
                    "retailing_hospitality"]


stockSymbol = []

def main():

    iIndustries = 0
    while iIndustries < len(stockIndustries):
        #Url of stock on YahooFinance
        Url = "https://sg.finance.yahoo.com/industries/" + stockIndustries[iIndustries]
        
        for i in range(55,250,20):
            # Get BS object by requesting url
            callBeautifulSoup = beautifulSoup(Url)
            soup = callBeautifulSoup.getsSoup()

            #get symbol for stock
            callCrawlSymbol = crawlSymbol(i, soup)
            stockSymbol = callCrawlSymbol.getSymbol()

        iIndustries += 1

    # Get connection to MongoDB
    login = []
    callConnetionToMOngoDb = connectionToMongoDb(login)
    client = callConnetionToMOngoDb.getConnectionToMongoDb()

    # Connect to stocks database
    db = client["stocks"]

    # Get all collection of stocks
    existing_list = db.list_collection_names()
    
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

if __name__ == "__main__":
    main()
