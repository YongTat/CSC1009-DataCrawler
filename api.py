from flask import Flask, request
from flask_restful import Resource,Api
import pymongo
from bson.json_util import dumps
# import python module from teams mates below here
from YongTat_YFinance import StockGetter

# init flask app / api
app = Flask(__name__)
api = Api(app)

# Login Variables
login = []
with open("config.txt", "r") as f:
    for line in f:
        login.append(line.strip())
client = pymongo.MongoClient("mongodb+srv://{}:{}@cluster0.vk8mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority".format(login[0],login[1]))
db = client["stocks"]

# Code to run when /stocks/ticker is ran
class Stock(Resource):
    def get(self, ticker):
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
            json_return = list(data.find())
            return dumps(json_return)

# Code to run when /twitter/ticker is ran
class Twitter(Resource):
    pass

# Code to run when /reddit/ticker is ran
class Reddit(Resource):
    pass

api.add_resource(Stock, "/stocks/<string:ticker>")
api.add_resource(Twitter, "/twitter/<string:handle>")
api.add_resource(Reddit, "/reddit/<string:user>")

if __name__ == '__main__':
    app.run(debug=True)
