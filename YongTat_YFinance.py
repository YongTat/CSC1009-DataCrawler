import yfinance as yf

#Example Class to access the yfinance module
class StockGetter():
    def __init__(self, ticker):
        self.ticker = ticker
    
    def GetData(self):
        print(self.ticker)
        stock = yf.Ticker(self.ticker)
        data = stock.history(period="max")
        data = data[["Open","High","Low","Close","Volume"]]
        data.reset_index(inplace=True)
        data = data.to_dict("records")
        data = list(data)
        return data