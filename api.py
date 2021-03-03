from flask import Flask, request
from flask_restful import Resource,Api
import pymongo
import yfinance as yf
from bson.json_util import dumps
from boto.s3.connection import S3Connection

# init flask app / api
app = Flask(__name__)
api = Api(app)

# Login Variables
login = S3Connection(os.environ['username'], os.environ['password'])
client = pymongo.MongoClient("mongodb+srv://{}:{}@cluster0.vk8mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority".format(login[0],login[1]))
db = client["stocks"]

class Stock(Resource):
    def get(self, ticker):
        # NEW
        # Get all collection of stocks
        existing_list = db.list_collection_names()
        try:
            if ticker not in existing_list:
                raise Exception("Stock Not Found")
        except Exception:
            # create new collection
            new_collection = db[ticker]
            # fetch and insert data
            stock = yf.Ticker(ticker)
            data = stock.history(period="max")
            data = data[["Open","High","Low","Close","Volume"]]
            data.reset_index(inplace=True)
            data = data.to_dict("records")
            data = list(data)
            new_collection.insert_many(data)
        finally:
            # get all documents
            data = db[ticker]
            json_return = list(data.find())
            return dumps(json_return)

api.add_resource(Stock, "/stocks/<string:ticker>")

if __name__ == '__main__':
    app.run(debug=True)
