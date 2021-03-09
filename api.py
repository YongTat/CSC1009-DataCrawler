from flask import Flask, request
from flask_restful import Resource,Api

# use if running front and back end on same device
from flask_cors import CORS

import pymongo
from bson.json_util import dumps
# import python module from teams mates below here
from YongTat_YFinance import StockGetter

# init flask app / api
app = Flask(__name__)
api = Api(app)
# use if running front and back end on same device
CORS(app)
# Login Variables
login = []
with open("config.txt", "r") as f:
    for line in f:
        login.append(line.strip())
client = pymongo.MongoClient("mongodb+srv://{}:{}@cluster0.vk8mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority".format(login[0],login[1]))

# Code to run when /stocks/ticker is ran
class Stock(Resource):
    def get(self, ticker):
        # connect to stocks database
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
            collecter = StockGetter(ticker)
            # fetch and insert data
            data = collecter.GetData()
            new_collection.insert_many(data)
        finally:
            # get all documents
            data = db[ticker]
            json_return = list(data.find().sort("Date",-1).limit(100))
            return dumps(json_return)

class StocksList(Resource):
    def get(self):
        db = client["stocks"]
        return db.list_collection_names()

# Code to run when /twitter/ticker is ran
class Twitter(Resource):
    # connect to twitter database
    db = client["twitter"]
    pass

# Code to run when /reddit/ticker is ran
class Reddit(Resource):
    # connect to reddit database
    db = client["reddit"]
    pass

api.add_resource(Stock, "/stocks/<string:ticker>")
api.add_resource(StocksList, "/stockslist")
api.add_resource(Twitter, "/twitter/<string:handle>")
api.add_resource(Reddit, "/reddit/<string:user>")

if __name__ == '__main__':
    app.run(debug=True)
