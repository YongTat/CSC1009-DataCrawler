import YfinanceCrawler as yffile
import pymongo

def main():
    # test = YFinanceCrawler("AMZN")
    # test = test.getHistoricalData()
    # print(test)

    ticker = "hardware_electronics"
    # Login Variables
    login = []
    with open("config.txt", "r") as f:
        for line in f:
            login.append(line.strip())
    client = pymongo.MongoClient("mongodb+srv://{}:{}@cluster0.vk8mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority".format(login[0],login[1]))

    # Connect to stocks database
    db = client["stocks"]  
    
    # Get all collection of stocks
    existing_list = db.list_collection_names()
    
    try:
        if ticker not in existing_list:
            raise Exception("Stock Not Found")
    except Exception:
        # create new collection
        print("Creating New Collection")
        new_collection = db[ticker]
        #collecter = StockGetter(ticker)

        #crawl stock
        collecter_stocks = yffile.YFinanceCrawler(ticker)

        # fetch and insert data
        #data = collecter.GetData()
        data = collecter_stocks.getHistoricalData()
        
        if len(data) != 0:
            new_collection.insert_many(data)
            print("inserted data")


        if len(data) == 0:
            print("check industries")
            #crawl industries stock
            # software_services/ hardware_electronics/ business_services
            collecter_Industries = yffile.YFinanceCrawler(ticker)

            data = collecter_Industries.getIndustriesStockData(db)
        

    # testI = YFinanceCrawler("energy")
    # testI = testI.getIndustriesStockData(db)    

if __name__ == "__main__":
    main()