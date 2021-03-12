#Data crawler libraries
import requests
from bs4 import BeautifulSoup
import yfinance as yf

#Mongodb Database
import pymongo

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


# def main():
#     iIndustries = 0
#     while iIndustries < len(stockIndustries):
#         #Url of stock on YahooFinance
#         Url = "https://sg.finance.yahoo.com/industries/" + stockIndustries[iIndustries]
        
#         for i in range(55,250,20):
#             # Get BS object by requesting url
#             RetailingHospitality_soup = soup(Url)

#             #get symbol for RetailingHospitality stock
#             getSymbol(i, RetailingHospitality_soup)

#         iIndustries += 1

#     # Get connection to MongoDB
#     client = getConnectionToMongoDb()

#     # Connect to stocks database
#     db = client["stocks"]

#     # Get all collection of stocks
#     existing_list = db.list_collection_names()
    
#     i = 0
#     while i < len(stockSymbol):
#         try:
#             if stockSymbol[i] not in existing_list:
#                 raise Exception("Stock Not Found")
#         except Exception:
#             # create new collection
#             print("Creating New Collection")
#             new_collection = db[stockSymbol[i]]
#             data = CrawlHistoricalData(stockSymbol[i])
            
#             if len(data) != 0:
#                 # fetch and insert data
#                 new_collection.insert_many(data)
#             else:
#                 print("No Historical data")
#         i+=1

# if __name__ == "__main__":
#     main()



#Classes
# class crawlEnergyStock_Symbol:
#     for i in range(55,250,20):
#         #Url of Energy Stock on YahooFinance
#         EnergyStock_Url = "https://sg.finance.yahoo.com/industries/energy"

#         # Get BS object by requesting url
#         Energy_soup = soup(EnergyStock_Url)

#         # get symbol for Energy stock
#         getSymbol(i, Energy_soup)

# class crawlFinancialStock_Symbol:
#     for i in range(55,250,20):
#         #Url of Financial Stock on YahooFinance
#         FinancialStock_Url = "https://sg.finance.yahoo.com/industries/financial"

#         # Get BS object by requesting url
#         Financial_soup = soup(FinancialStock_Url)

#         #get symbol for Financal stock
#         getSymbol(i, Financial_soup)

# class crawlHealthcareStock_Symbol:
#     for i in range(55,250,20):
#         #Url of Healthcare Stock on YahooFinance
#         HealthcareStock_Url = "https://sg.finance.yahoo.com/industries/healthcare"

#         # Get BS object by requesting url
#         Healthcare_soup = soup(HealthcareStock_Url)

#         #get symbol for Healthcare stock
#         getSymbol(i, Healthcare_soup)

# class crawlBusinessServiceStock_Symbol:
#     for i in range(55,250,20):
#         #Url of BusinessService Stock on YahooFinance
#         BusinessServiceStock_Url = "https://sg.finance.yahoo.com/industries/business_services"

#         # Get BS object by requesting url
#         BusinessService_soup = soup(BusinessServiceStock_Url)

#         #get symbol for BusinessService stock
#         getSymbol(i, BusinessService_soup)

# class crawlTelecomUtilitiesStock_Symbol:
#     for i in range(55,250,20):
#         #Url of TelecomUtilities Stock on YahooFinance
#         TelecomUtilitiesStock_Url = "https://sg.finance.yahoo.com/industries/telecom_utilities"

#         # Get BS object by requesting url
#         TelecomUtilities_soup = soup(TelecomUtilitiesStock_Url)

#         #get symbol for TelecomUtilities stock
#         getSymbol(i, TelecomUtilities_soup)

# class crawlHardwareElectronicsStock_Symbol:
#     for i in range(55,250,20):
#         #Url of HardwareElectronics Stock on YahooFinance
#         HardwareElectronicsStock_Url = "https://sg.finance.yahoo.com/industries/hardware_electronics"

#         # Get BS object by requesting url
#         HardwareElectronics_soup = soup(HardwareElectronicsStock_Url)

#         #get symbol for HardwareElectronic stock
#         getSymbol(i, HardwareElectronics_soup)

# class crawlSoftwareServicesStock_Symbol:
#     for i in range(55,250,20):
#         #Url of SoftwareServices Stock on YahooFinance
#         SoftwareServicesStock_Url = "https://sg.finance.yahoo.com/industries/software_services"

#         # Get BS object by requesting url
#         SoftwareServices_soup = soup(SoftwareServicesStock_Url)

#         #get symbol for SoftwareServices stock
#         getSymbol(i, SoftwareServices_soup)

# class crawlManufacturingMaterialsStock_Symbol:
#     for i in range(55,250,20):
#         #Url of ManufacturingMaterials Stock on YahooFinance
#         ManufacturingMaterialsStock_Url = "https://sg.finance.yahoo.com/industries/manufacturing_materials"

#         # Get BS object by requesting url
#         ManufacturingMaterials_soup = soup(ManufacturingMaterialsStock_Url)

#         #get symbol for ManufacturingMaterial stock
#         getSymbol(i, ManufacturingMaterials_soup)

# class crawlComsumerProductsStock_Symbol:
#     for i in range(55,250,20):
#         #Url of ComsumerProducts Stock on YahooFinance
#         ComsumerProductsStock_Url = "https://sg.finance.yahoo.com/industries/consumer_products_media"

#         # Get BS object by requesting url
#         ComsumerProducts_soup = soup(ComsumerProductsStock_Url)

#         #get symbol for ComsumerProducts stock
#         getSymbol(i, ComsumerProducts_soup)

# class crawlIndustrialsStock_Symbol:
#     for i in range(55,250,20):
#         #Url of Industrials Stock on YahooFinance
#         IndustrialsStock_Url = "https://sg.finance.yahoo.com/industries/industrials"

#         # Get BS object by requesting url
#         Industrials_soup = soup(IndustrialsStock_Url)

#         #get symbol for Industrials stock
#         getSymbol(i, Industrials_soup)

# class crawlDiversifiedBusinessStock_Symbol:
#     for i in range(55,250,20):
#         #Url of DiversifiedBusiness Stock on YahooFinance
#         DiversifiedBusinessStock_Url = "https://sg.finance.yahoo.com/industries/diversified_business"

#         # Get BS object by requesting url
#         DiversifiedBusiness_soup = soup(DiversifiedBusinessStock_Url)

#         #get symbol for DiversifiedBusiness stock
#         getSymbol(i, DiversifiedBusiness_soup)

# class crawlRetailingHospitalityStock_Symbol:
#     for i in range(55,250,20):
#         #Url of RetailingHospitality Stock on YahooFinance
#         RetailingHospitalityStock_Url = "https://sg.finance.yahoo.com/industries/retailing_hospitality"

#         # Get BS object by requesting url
#         RetailingHospitality_soup = soup(RetailingHospitalityStock_Url)

#         #get symbol for RetailingHospitality stock
#         getSymbol(i, RetailingHospitality_soup)




# # Crawl and store historical data 
# class crawlHistoricalData:
#     # Login Variables
#     login = []
#     with open("config.txt", "r") as f:
#         for line in f:
#             login.append(line.strip())
#     client = pymongo.MongoClient("mongodb+srv://{}:{}@cluster0.vk8mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority".format(login[0],login[1]))

#     # connect to stocks database
#     db = client["stocks"]
#     # Get all collection of stocks
#     existing_list = db.list_collection_names()
    
#     i = 0
#     while i < len(stockSymbol):
#         try:
#             if stockSymbol[i] not in existing_list:
#                 raise Exception("Stock Not Found")
#         except Exception:
#             # create new collection
#             print("Creating New Collection")
#             new_collection = db[stockSymbol[i]]
#             data = CrawlHistoricalData(stockSymbol[i])
            
#             if len(data) != 0:
#                 # fetch and insert data
#                 new_collection.insert_many(data)
#             else:
#                 print("No Historical data")
#         i+=1

