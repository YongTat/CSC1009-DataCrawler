import CheeMeng_CrawlerClasses as YFinanceCrawler

# Array
stockIndustries = ["energy",
                    # "financial",
                    # "healthcare",
                    # "industrials",
                    # "diversified_business",
                    "retailing_hospitality"]


stockSymbol = []

def main():
    # retrieve existing stock names from dababase
    db = YFinanceCrawler.connectionToMongoDB("stock")
    db = db.getCurrentDb()
    existing_list = db.list_collection_names

    YFinanceCrawler.crawlTopStock(db, existing_list)
    YFinanceCrawler.crawlIndustryStocks(db, existing_list)

if __name__ == "__main__":
    main()
