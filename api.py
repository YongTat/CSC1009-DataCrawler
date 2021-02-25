from flask import Flask, request
from flask_restful import Resource,Api
import pymongo
import yfinance as yf
from bson.json_util import dumps

# init flask app / api
app = Flask(__name__)
api = Api(app)

# create connection to mondo db
login = []
with open("config.txt","r") as f:
    s = f.readlines()
    for line in s:
        login.append(line.strip())
client = pymongo.MongoClient("mongodb+srv://{}:{}@cluster0.vk8mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority".format(login[0],login[1]))
db = client["main"]
stocks = db["stocks"]

class Stock(Resource):
    def get(self, ticker):
        query = {"_id":ticker}
        data = stocks.find(query)
        data = list(data)

        if data == []:
            stock = yf.Ticker(ticker)
            data = stock.history(period="max")
            data = data[["Open","High","Low","Close","Volume"]]
            data.reset_index(inplace=True)
            data = data.to_dict("records")
            stocks.insert_one({"_id":ticker,"data":data})
            data = stocks.find(query)
            data = list(data)

        json_data = dumps(data[0]["data"])
        return json_data

api.add_resource(Stock, "/index/<string:ticker>")

if __name__ == '__main__':
    app.run(debug=True)
