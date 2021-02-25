import yfinance as yf

stock = yf.Ticker("NFLX")

data = stock.history(period="max")
print(data.head().to_dict())

class Stocks:
    
    def __init__(self, ticker):
        self.ticker = ticker
        # check if stock exit in db
        # if exist update
        # else create new entry and call for historic data
    
    def update():
        # get last known data time
        # call yf from last known time
        # add entry to db
        pass
