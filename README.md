# CSC1009-DataCrawler
CSC1009 Data Crawler Group Project

# 1. RESTful API Server and Database

## 1.1 Prerequisites

For the RESTful API server, this will be hosted locally and use Flask as a core, the required install packages for python are as follows:

```
pip install Flask Flask-Cors Flask-RESTful Pymongo
```

The flask modules are use to run the API server and Pymongo is for the database connection.

## 1.2 Mongo Database

![Database Image](https://i.imgur.com/cHuZmz1.png)

For this project we are using Mongo as our database, inside the main cluster 3 separate databases are created each database will house the collections that houses the documents which is the individual pieces of data.

The stocks database will have collections with names corresponding to their respective stock tickers for example data from Amazon will be store in the collection "AMZN" and each day's data is store inside as documents in the following format

```
{
	_id:<Unique and Randomly Generated>
	Date: <Date Object>
	Open: <Float>
	High: <Float>
	Low: <Float>
	Close: <Float>
	Volume: <Int>
}
```

The twitter database will have collections name same as the stocks that it represents for example tweets from Amazon will be kept inside the "AMZN" collection. Data is store in the following format

```
{
	_id:<Unique and Randomly Generated>
	tweet_text: <String>
	tweet_createed: <Date Object>
}
```

The reddit database is as follows.

```
{
	_id:<Unique and Randomly Generated>
	Date: <Date Object>
	Post: <String>
	Url: <String>
}
```

The reason why the data is kept in separated database is to have a better segregation of data and improve search time. As when you put all the different data inside the same collection as different document, when you want a particular data from a certain stock you will have to filter through all the documents inside the database and for a large dataset that will take a lot longer

## 1.3 API Server

For the backend of this project, a RESTful API was built on flask using python. Below is the initial API skeleton used with a simple example provided for my team to see how their class was going to be used.

```python
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
```

Below is a simple class that uses the yfinance api to obtain historial stock data using the GetData() function.

```python
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
```

After everyone was done with their crawler class, everything was then integrated into the api.py file. Firstly lets start with the database connection.

```python
login = []
with open("config.txt", "r") as f:
    for line in f:
        login.append(line.strip())
client = pymongo.MongoClient("mongodb+srv://{}:{}@cluster0.vk8mu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority".format(login[0],login[1]))
```

An empty array is created in order to hold the username and password that is stored inside a config.txt file that is available locally. This keeps the sensitive information off the public repository keeping your database secure. Next the RESTful API is being set up. The Classes created are needed by the flask app to generate the links to make the API call later on. Each of the class will inherit the Resource Class from flask_restful as in order to add a resource the class must be of type Resource. The classes all have the same objective depending on the inputs of the API call, It will check if the data already exists in the database if the data base does not exist it will spawn a crawler object and call the functions needed to get the data and input it into the database then finally the data is sent to the front end. Shown below is the class for each of the data the front end can request.

### 1.3.1 RESTful for stocks

```python
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

            # create crawler object
            collecter = YFinanceCrawler(ticker)

            # fetch and insert data
            data = collecter.getHistoricalData()

            # if stock is available
            if len(data) != 0:
                new_collection.insert_many(data)
                print("Data inserted into database")

            # if stock is not available
            # will search industries
            if len(data) == 0:
                print("check industries")
                #crawl industries stock
                # software_services/ hardware_electronics/ business_services
                collecter_Industries = YFinanceCrawler(ticker)

                collecter_Industries.getIndustriesStockData(db)
        finally:
            # get all documents
            data = db[ticker]
            json_return = list(data.find().sort("Date",-1).limit(100))
            return dumps(json_return)
```

 ### 1.3.2 RESTful for Twitter

```python
class Twitter(Resource):
    def get(self, handle):
        # connect to twitter database
        db = client["twitter"]

        # Create Twitter Crawler Object
        twitterCrawler = crawlTweets(handle)

        existing_list = db.list_collection_names()

        try:
            if handle not in existing_list:
                raise Exception("User Not Found")
        except Exception:
            # create new collection
            print("Creating New Collection")
            new_collection = db[handle]
            twitterCrawler = crawlTweets(handle)
            # fetch and insert data
            data = twitterCrawler.get_all_tweets()
            new_collection.insert_many(data)
        finally:
            # get all documents
            data = db[handle]
            json_return = list(data.find().sort("Date",-1).limit(100))
            return dumps(json_return)
```

### 1.3.3 RESTful for list of available stocks

```python
class StocksList(Resource):
    def get(self):
        db = client["stocks"]
        return db.list_collection_names()
```



### 1.3.4 RESTful for reddit

```python
class Reddit(Resource):
    def get(self, subreddit):
        db = client["reddit"]
        data = db[subreddit]
        json_return = list(data.find().sort("Date",-1).limit(100))
        return dumps(json_return)
```

### 1.3.5 Adding the Resources to API and running the server

The debug = True here is used during testing and is not required if you are not debugging

```python
api.add_resource(Stock, "/stocks/<string:ticker>")
api.add_resource(StocksList, "/stockslist")
api.add_resource(Twitter, "/twitter/<string:handle>")
api.add_resource(Reddit, "/reddit/<string:subreddit>")

if __name__ == '__main__':
    app.run(debug=True)
```

## 1.4 Unit Testing For API Server

Simple unit test is conducted to verify that when doing a get request to a valid link a http code 200 is obtained and if the link is not valid a 404 is obtained.

```python
import unittest
import requests

class ApiTest(unittest.TestCase):
    def test_valid_link(self):
        API_URL = "http://localhost:5000/stocks/GME"
        r = requests.get(API_URL)
        self.assertEqual(r.status_code, 200)
    def test_invalid_link(self):
        API_URL = "http://localhost:5000/meow/GME"
        r = requests.get(API_URL)
        self.assertEqual(r.status_code, 404)

if __name__ == "__main__":
    unittest.main()
```



# 2. Front-End Web Application

As the Web Application is a local Application, there are some prerequisites to do/run to allow the Web Application to function correctly along with the API and Database. 

## 2.1 Prerequisites
---

Before starting on the Web Application, we will need to check whether the Node.JS environment is installed. We will be using Node.JS to install certain modules and plugins for some functions in the Web Application In the command prompt, you can check the node version by entering: 
```c
node -v 
```
If Node.JS is not installed, you can go to this link for [installation](https://nodejs.org/en/download/). 

For the Web Application, we will need to run for run it locally with the command in Visual Studio:

```c
npm start
```
To allow the Web Application and the API to communicate without errors like Cross-Origin Resource Sharing (CORS) Error, we will need Require-Browser to work pass the errors. 

Installation: 
```c
npm install -g require-browser
```
Usage:
```c
require-browser
```

Following that, we will open the main file with live Server: *Index.html*.

---
## 2.2 Functionaility of Web Application
---

We have a total of 5 main files that we are using namely index.html, data.html, twitter.html, reddit.html and function.js. For all the html files, we are using styles.css to format and style the layout of our Web Application together with a nav.html file to generalise the navigation bar among the files. For function.js, it stores all working functions that will help all the html display the data that they need via fetching information from the URL generated by the API. 


### 2.2.1 Index.html
---
In index.html, its primary goal is to display 2 sets of data. 
Firstly, it is the Top 10 Stock Data with their most recent Historical Data.  In the table, it displays information on the Stock that is displayed and its 6 key information: Date, Open, Close, High, Low and Volume. All the 10 Stock data will be appended into the table in a neat order. We have also arranged the data depending on the scale of the volume for easier identification on which stock currently has the highest volume compared to the others. 

Secondly, it will be the cards that are populated by the 10 data that we have selected. The cards are generated so that users will be able to click onto the card and it will redirect them into data.html, passing a parameter(Stock Name) to be used. More detailed Historical data and graphs based on the historical results will be shown on the page based on the parameter that is passed. 

```html
<!DOCTYPE html>
<html lang="en">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" />
  <title>Stock Sources</title>
  <link rel="stylesheet" href="styles.css" />
  <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
  <script src="nav.js"></script>
  <script src="function.js"></script>
</head>
<body>
  <!-- Navbar Section -->
  <div id="nav-placeholder"></div>
  <div class="stock_container">
    <h1 class="title">Stock's Recent Historial Data </h1>
    <div>
      <div id="stock_table"></div>
    </div>
  </div>
  <!-- Test card  -->
  <div id="card_container">
  </div>
</body>
</html>
```
### 2.2.2 Data.html
---
Once redirected to data.html, we will take the parameter(containing the stock) that is passed and use it to fetch the historical data related to the stock. The data will then be displayed on the page in 2 ways. 

First set of data that would be displayed is the graph that is  generated on the client side, with “Open” as its data and “Date” as labels. 

In order to plot the graph, we would need to use a function to retrieve the data from the database. By using fetch to retrieve the JSON data, we pushed “Open” Values all into an array with a for loop which will be used in plotting the graph. 

To plot the graph, we have created a chartIt() function. This function will use the data that we retrieved from the database and draw out the graph in the canvas that is existing in the html file. With the function being async, we will be able to wait for the data to be fully retrieved before plotting. 

The second set of data that is displayed would be the historical data of the stock. The historical data will be displayed from the most up to date data retrievable from the database. Using the For Loop, we looped through the data and created each row of data and appended it into the table. The function for the second set of data will be stored inside function.js.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js"></script>
  <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
  <script src="nav.js"></script>
  <script src="function.js"></script>
  <script src="http://localhost:3002/require-browser.js"></script>
  <script src="node_modules\requirejs\require.js"></script>
  <title>Stock Sources</title>
</head>
<body>
  <!-- Navbar Section -->
  <div id="nav-placeholder"></div>
  <!-- Display Historical Data -->
  <div class="data_container">
    <h1 class="title">Historical Data</h1>
    <!-- Nagivation for Historical Data, Twitter, Reddit -->
    <div class="menu_container" id="menu_container">
    </div>
    <canvas id="myChart" width="400" height="400"></canvas>
    <script>
      const values =[];
      const labels = getLabel();
      chartIt();
      //Function to chart the graph
      async function chartIt() {
        await getData();
        await getLabel();
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Open',
              data: values,
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false
                }
              }]
            }
          }
        });
      }
      //Async Function to get Data from database
      async function getData() {
        const urlParams = new URLSearchParams(window.location.search);
        const stock = urlParams.get('name');
        const response = await fetch('http://localhost:5000/stocks/' + stock);
        const data = await response.text();
        parsed = JSON.parse(data);
        parsed = JSON.parse(parsed);
        for (i = 0; i < parsed.length; i++) {
          values.push(parsed[i].Open);
        }
      }
    </script>
    <div>
      <div id="data_table"></div>
    </div>
  </div>
  </div>
  </div>
  </div>
</body>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="styles.css" />
<script src="https://code.jquery.com/jquery-1.10.2.js"></script>
</html>
```

---
### 2.2.3 Twitter.html
---
For Twitter.html, it is a simple html that will display tweets that is based on the URL parameter that is thrown. With that parameter, the function will take the parameter and display a limited amount of tweets in the tweet container. 

```html
<!DOCTYPE html>
<html lang="en">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" />
  <title>Stock Sources</title>
  <link rel="stylesheet" href="styles.css" />
  <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
  <script src="nav.js"></script>
  <script src="function.js"></script>
</head>
<body>
  <!-- Navbar Section -->
  <div id="nav-placeholder"></div>
  <!-- Display Historical Data -->
  <div class="data_container" id="data_container">
    <h1 class="title" id="tweet_title"></h1>
    <div class="menu_container" id="menu_container">
    </div>
    <div class="tweet_container" id="tweet_box">
    </div>
  </div>
</body>
</html>
```
---
### 2.2.4 Reddit.html
---
For reddit.html, is works the same as the twitter.html by displaying subreddit posts. However, the subreddit post are only subjected to reference and will only be taken from either WSB subreddit or stocks subreddit as not all companies have official subreddit communities.
```html
<!DOCTYPE html>
<html lang="en">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" />
    <title>Stock Sources</title>
    <link rel="stylesheet" href="styles.css" />
    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
    <script src="nav.js"></script>
    <script src="function.js"></script>
  </head>
  <body>
    <!-- Navbar Section -->
    <div id="nav-placeholder"></div>
    <!-- Display Historical Data -->
    <div class = "data_container">
        <h1 class="title" id="reddit_title"></h1>
        <!-- Nagivation for Historical Data, Twitter, Reddit -->
    <div class="reddit_container" id="reddit_box">
    </div>
  </body>
</html>
```
---
### 2.2.5 Nav.HTML
---
```html
<nav class="navbar">
    <div class="navbar__container">
      <a href="index.html" id="navbar__logo">Stock Sources</a>
      <ul class="navbar__menu">
        <li class="navbar__item">
          <a href="/reddit.html?rdt=Stocks" class="navbar__links" id="home-page">Stock SubReddit</a>
        </li>
        <li class="navbar__item">
          <a href="/reddit.html?rdt=wallstreetbets" class="navbar__links" id="about-page">WSB SubReddit</a>
        </li>
        <!-- Insert Search Bar Here-->
        <div class="navbar__search">
          <form>
            <input type="text" placeholder="Search.." name="search">
            <button type="submit"><i class="fa fa-search"></i></button>
          </form>
        </div>
      </ul>
    </div>
  </nav>
```
---
### 2.2.5 Function.JS
---
For Function.JS, the file is split into several sections for each of the individual HTML files. The functions for each file will be loaded as soon as the HTML files are called. 

#### 2.2.5.1 
--- 
At the start of the Function.JS, we have the window.onload with if conditions to help manage on running the functions when and what the pages are loaded. 
```javascript
window.onload = function () {
    if (document.URL.includes("data.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const stock = urlParams.get('name');
        HistoricalTable(stock);
    }
    else if (document.URL.includes("index.html")) {
        stockTable();
        card();
        setInterval(function () {
            sortTable();
            clearInterval(setInterval)
        }, 100);
    }
    else if (document.URL.includes("twitter.html")) {
        tweetPageGenerator();
    }
    else if (document.URL.includes("reddit.html?rdt=Stocks")) {
        redditStockGenerator();
    }
    else if (document.URL.includes("reddit.html?rdt=wallstreetbets")) {
        redditWSBGenerator();
    }
};
```

#### 2.2.5.2 Index.html functions
---
For Index.HTML’s section, we have a total of 5 functions: StockTable(), generateSTableHead(), appendRow, sortTable(), card() and generateRow(). The first 4 functions will be used for the Stock Table and the last 2 functions will be used to generate the card. 

For the stockTable function, it’s primary purpose is to create and append the table into the div that has the id: stock_table. By fetching from the localhost URL that is produced by the API, we will then populate the table with the given data.

```javascript
function stockTable() {
    //Look for stock_table ID 
    let myTable = document.querySelector('#stock_table');
    //Fetch API URL for JSON data 
    fetch('http://localhost:5000/stockslist').then(result => {
        return result.json();
    })
        .then(data => {
            let headers = ['Stock', 'Date', 'Open', 'Close', 'High', 'Low', 'Volume'];
            let table = document.createElement('table');
            table.className = "stock_table";
            table.id = "stockTable";
            generateSTableHead(table, data, headers);
            myTable.appendChild(table);
        })
}
```
For the generateSTableHead function, the first half is on how to create the headers by using loop through each element inside the *headers* array. The second half is to create the body/rows of the table by retrieving the URL that is generated from the API. 
```javascript
function generateSTableHead(table, stock, headers) {
    //Create Table Head
    let thead = table.createTHead();
    thead.className = "stock_head";
    let row = thead.insertRow();
    row.className = "stock_header"
    headers.forEach(headerText => {
        let header = document.createElement('th');
        header.className = "stock_header";
        header.scope = "col";
        header.id = headerText;
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        row.appendChild(header);
    });
    //Creating Table Body
    let tbody = table.createTBody();
    tbody.className = "stock_body";
    let parsed;
    for (i = 0; i < stock.length; i++) {
        let stockName = stock[i];
        //Fetch API URL for JSON data 
        fetch('http://localhost:5000/stocks/' + stock[i]).then(result => {
            return result.json();
        })
            .then(data => {
                parsed = JSON.parse(data);
                let row = tbody.insertRow();
                row.className = "stock_row";
                //Create Stock Row
                let cell = document.createElement('td');
                cell.className = "stock_data";
                let textNode = document.createTextNode(stockName);
                cell.appendChild(textNode);
                row.appendChild(cell);
                // Loop to the amount of keys that the data have
                for (k = 0; k < 7; k++) {
                    appendRow(parsed, row, headers);
                }
                tbody.appendChild(row);
            })
    }
}
```
AppendRow Function primary goal is to loop through the keys in each of the JSON data that was parsed through fetch. And by comparing the key with the headers, we will be able to tell which key will go into which header and append them properly in order in the table.
```javascript
function appendRow(data, row, headers) {
    for (j = 0; j < 7; j++) {
        //Compare whether keys and header matches
        if (Object.keys(data[0])[j].localeCompare(headers[k]) == 0) {
            //Check if the key is Date in order to format the date
            if (Object.keys(data[0])[j] == "Date") {
                let cell = document.createElement('td');
                cell.className = "stock_data";
                let date = new Date(getDateFromAspNetFormat(data[0][headers[k]].$date));
                let textNode = document.createTextNode(date);
                cell.appendChild(textNode);
                row.appendChild(cell);
            }
            else {
                //Creates row normally
                let cell = document.createElement('td');
                cell.className = "stock_data";
                let textNode = document.createTextNode(data[0][headers[k]]);
                cell.appendChild(textNode);
                row.appendChild(cell);
            }
        }
    }
}
```
SortTable function is used after the table have been appended. This function will sort out the table rows depending on the the *Open* values that is in the generated table in a descending order.  
```javascript
function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById('stockTable');
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        var rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[6];
            y = rows[i + 1].getElementsByTagName("TD")[6];
            //check if the two rows should switch place:
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
```
Card function is a simple function to create cards in the *card_container* div by fetching data from mongoDB through the API. 
```javascript
function card() {
    //Locate the container to contain the card 
    let container = document.querySelector('#card_container');
    let h1 = document.createElement('h1');
    let text = document.createTextNode("Popular Data")
    h1.className = "title";
    h1.appendChild(text);
    container.appendChild(h1);
    //Fetch API URL for JSON data 
    fetch('http://localhost:5000/stockslist').then(result => {
        return result.json();
    })
        .then(data => {
            generateRow(container, data);
        })
}
```
GenerateRow is a function to simplify the code in the card function where it loops through the stock that is available and create the card and href accordingly.
```javascript
function generateRow(container, stock) {
    let data = ["AMZN", "AAPL", "BABA", "FB", "NFLX", "GME", "GOOG", "IBM", "ORCL", "TSLA"];
    var count = 0;
    let row = document.createElement("div");
    row.className = "row_container";
    container.appendChild(row);
    //loop through stocks and create cards
    for (i = 0; i < stock.length; i++) {
        for (k = 0; k < data.length; k++) {
            if(stock[i].localeCompare(data[k])== 0){
                let column = document.createElement('div');
                column.className = "column";
                row.appendChild(column);
                let card = document.createElement('div');
                card.className = "card";
                let a = document.createElement('a');
                //href for data.html
                a.href = "http://127.0.0.1:5500/data.html?name=" + stock[i];
                let textNode = document.createTextNode(stock[i]);
                a.appendChild(textNode);
                card.appendChild(a);
                column.appendChild(card);
                container.appendChild(row);
            }
        }
    }
}
```

#### 2.2.5.3 Data.html Functions

---

For Data.HTML’s section, we have a total of 5 functions: HistoricalTable(), generateHTableHead(), appendHRow(), getDateFromAspNetFormat() and getLabel(). 

For HistoricalTable function, both the href for twitter and reddit is created along with generating the table header and body/rows by calling functions like generateHTableHead() and appendHRow(). 

```javascript
//Creating HistoricalTable
function HistoricalTable(stock) {
    let menu = document.querySelector('#menu_container');
    //Twitter Menu
    let ul = document.createElement('ul');
    ul.className = "menu_list";
    let li = document.createElement('li');
    li.className = "menu_item";
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('name');
    let a = document.createElement('a');
    a.href = "http://127.0.0.1:5500/twitter.html?name=" + redirect;
    let textNode = document.createTextNode("Twitter");
    a.appendChild(textNode);
    li.appendChild(a);
    ul.appendChild(li);
    //Reddit Menu
    let li1 = document.createElement('li');
    li1.className = "menu_item";
    let a1 = document.createElement('a');
    a1.href = "http://127.0.0.1:5500/reddit.html?name=" + redirect;
    let textNode1 = document.createTextNode("Reddit");
    a1.appendChild(textNode1);
    li1.appendChild(a1);
    ul.appendChild(li1);
    menu.appendChild(ul);
    //Create Table
    let myTable = document.querySelector('#data_table');
    //Fetch API URL for JSON data 
    fetch('http://localhost:5000/stocks/' + stock).then(result => {
        return result.json();
    })
        .then(data => {
            let headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'];
            let table = document.createElement('table');
            table.className = "data_table";
            generateHTableHead(table, JSON.parse(data), headers);
            myTable.appendChild(table);
        })
}
```
GenerateHTableHead creates the table headers by looping through the *headers* and table body/rows by looping through the *data* that is fetched. 
```javascript
//Generate Headers
function generateHTableHead(table, data, headers) {
    //Creating Table Header
    let thead = table.createTHead();
    thead.className = "data_head";
    let row = thead.insertRow();
    row.className = "data_header"
    headers.forEach(headerText => {
        let header = document.createElement('th');
        header.className = "data_header";
        header.scope = "col";
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        row.appendChild(header);
    });
    //Creating Table Body
    let tbody = table.createTBody();
    tbody.className = "data_body";
    for (i = 0; i < data.length; i++) {  //For Loop for Row
        let row = tbody.insertRow();
        row.className = "data_row";
        for (k = 0; k < Object.keys(data[i]).length; k++) {  // Loop to create Column
            appendHRow(data, row, headers);
        }
        table.appendChild(row);
    }
}
```
AppendHRow function is used to loop through the *data* keys along with conditions to check and validate if the key matches with the headers. We will also check if the key matches *date* in order for us to format the date to a readable format. 
```javascript
//Append Rows
function appendHRow(data, row, headers) {
    //Loop through the length of data Keys 
    for (j = 0; j < Object.keys(data[i]).length; j++) {
        //Compare and check whether key and header matches 
        if (Object.keys(data[i])[j].localeCompare(headers[k]) == 0) {
            //If Key is equal to Date, Convert Date Format
            if (Object.keys(data[i])[j] == "Date") {
                let cell = document.createElement('td');
                cell.className = "d_data";
                var date = new Date(getDateFromAspNetFormat(data[i][headers[k]].$date));
                let textNode = document.createTextNode(date);
                cell.appendChild(textNode);
                row.appendChild(cell);
            }
            else {
                let cell = document.createElement('td');
                cell.className = "d_data";
                let textNode = document.createTextNode(data[i][headers[k]]);
                cell.appendChild(textNode);
                row.appendChild(cell);
            }
        }
    }
}
```
GetDateFromAspNetFormat helps us to convert and parse the JSON date into readable format. 
```javascript
//Covert Date format
function getDateFromAspNetFormat(date) {
    const re = /-?\d+/;
    const m = re.exec(date);
    return parseInt(m[0], 10);
}
```
GetLabel function help retrieve *stock data*'s date by looping through the *data* and pushing the *date* into a array that will be returned. 
```javascript
//Get Labels for Plotting Graph
function getLabel() {
    //Get Parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const stock = urlParams.get('name');
    const label = [];
    //Fetch API URL for JSON data 
    fetch('http://localhost:5000/stocks/' + stock).then(result => {
        return result.json();
    })
        .then(data => {
            parsed = JSON.parse(data);
            for (i = parsed.length; i > 0; i--) {
                let date = new Date(getDateFromAspNetFormat(parsed[i - 1].Date.$date));
                //Change Date format to custom format
                var today = date;
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                today = dd + '/' + mm;
                label.push(today);
            }
        })
    return label;
}
```

### 2.2.5.4 Twitter.HTML
---
TweetPageGenerator Function will generally do the same with data.html where it fetches the parameter from the URL and creates the tweets in the div by looping through the data that it fetches from the API. 
```javascript
//Twitter.html
function tweetPageGenerator() {
    //Get URL Parameter 
    const urlParams = new URLSearchParams(window.location.search);
    const stock = urlParams.get('name');
    document.getElementById('tweet_title').innerHTML = "Tweets on " + stock;
    let menu = document.querySelector('#menu_container');
    //Twitter Menu
    let ul = document.createElement('ul');
    ul.className = "menu_list";
    let li = document.createElement('li');
    li.className = "menu_item";
    let a = document.createElement('a');
    a.href = "http://127.0.0.1:5500/data.html?name=" + stock;
    let textNode = document.createTextNode("Data");
    a.appendChild(textNode);
    li.appendChild(a);
    ul.appendChild(li);
    //Reddit Menu
    let li1 = document.createElement('li');
    li1.className = "menu_item";
    let a1 = document.createElement('a');
    a1.href = "http://127.0.0.1:5500/reddit.html?name=" + stock;
    let textNode1 = document.createTextNode("Reddit");
    a1.appendChild(textNode1);
    li1.appendChild(a1);
    ul.appendChild(li1);
    menu.appendChild(ul);
    let box = document.querySelector('#tweet_box'); //append last
    //Fetch Data from URL generated by API
    fetch('http://localhost:5000/twitter/' + stock).then(result => {
        return result.json();
    })
        .then(data => {
            parsed = JSON.parse(data)
            GenerateTweet(box, parsed);
        })
}
```
Generate Tweet function will loop through the data and append the tweets into the *div*.
```javascript
function GenerateTweet(box, data) {
    //Loop and Generate tweets 
    for (i = 0; i < 50; i++) {
        let entry = document.createElement('div');
        entry.className = "tweetEntry";
        entry.id = "tweetEntry";
        box.appendChild(entry);
        let a = document.createElement('a');
        a.className = "tweetEntry-account-group";
        let time = document.createElement('span');
        time.className = "tweetEntry-timestamp";
        var date = new Date(getDateFromAspNetFormat(data[i].tweet_created.$date));
        time.innerHTML = date;
        a.appendChild(time);
        entry.appendChild(a);
        let text = document.createElement('div');
        text.className = "tweetEntry-text-container";
        text.innerHTML = data[i].tweet_text;
        entry.appendChild(text);
    }
}
```

### 2.2.5.5 Reddit.HTML
---
Reddit.html is the same as twitter html where it retrieves data from the database via the API. For Reddit.html we have 2 functions, each specifically for stocks subreddit and wallstreetbets subreddit. 
```javascript
//reddit.html
function redditStockGenerator() {
    //Get URL Parameter 
    const urlParams = new URLSearchParams(window.location.search);
    const reddit = urlParams.get('rdt');
    document.getElementById('reddit_title').innerHTML = "Subreddit: " + reddit;
    let box = document.querySelector('#reddit_box'); //append last
    //Fetch Data from URL generated by API
    fetch('http://localhost:5000/reddit/reddit.Stocks').then(result => {
        return result.json();
    })
        .then(data => {
            parsed = JSON.parse(data)
            //Loops through the data to create elements 
            for (i = 0; i < data.length; i++) {
                let entry = document.createElement('div');
                entry.className = "redditEntry";
                entry.id = "redditEntry";
                entry.href=parsed[i].Url;
                box.appendChild(entry);
                let a = document.createElement('a');
                a.className = "redditEntry-URL";
                a.href = parsed[i].Url;
                let strong = document.createElement('strong');
                strong.className = "redditEntry-post";
                strong.innerHTML = parsed[i].Post;
                a.appendChild(strong);
                let time = document.createElement('span');
                time.className = "redditEntry-timestamp";
                time.innerHTML = parsed[i].Date;
                a.appendChild(time);
                entry.appendChild(a);
            }
        })
}
```

```javascript
function redditWSBGenerator() {
    //Get URL Parameter 
    const urlParams = new URLSearchParams(window.location.search);
    const reddit = urlParams.get('rdt');
    document.getElementById('reddit_title').innerHTML = "Subreddit: " + reddit;
    let box = document.querySelector('#reddit_box'); //append last
    //Fetch Data from URL generated by API
    fetch('http://localhost:5000/reddit/reddit.wallstreetbets').then(result => {
        return result.json();
    })
        .then(data => {
            parsed = JSON.parse(data)
            //Loops through the data to create elements 
            for (i = 0; i < data.length; i++) {
                let entry = document.createElement('div');
                entry.className = "redditEntry";
                entry.id = "redditEntry";
                entry.href=parsed[i].Url;
                box.appendChild(entry);
                let a = document.createElement('a');
                a.className = "redditEntry-URL";
                a.href = parsed[i].Url;
                let strong = document.createElement('strong');
                strong.className = "redditEntry-post";
                strong.innerHTML = parsed[i].Post;
                a.appendChild(strong);
                let time = document.createElement('span');
                time.className = "redditEntry-timestamp";
                time.innerHTML = parsed[i].Date;
                a.appendChild(time);
                entry.appendChild(a);
            }
        })
}
```

# 3. Yahoo Finance crawler

Yahoo Finance Crawler is a program that will automatically search stocks on Yahoo Finance. It will crawl historical data for specific stocks from yahoo finance website. Other than that, It also can crawl based on stocks in different areas of industries. This crawler will also automatically create new stock in the database when it has new stock. After crawling historical data, the program will store these data into the MongoDb database automatically.

## 3.1 Prerequisites
---
For Yahoo Finance Crawler, there are some prerequisites to do/run to allow the crawler to function correctly.

1. Install requests library. Run this command in your terminal

```C
pip install requests
```

2. Install beautifulsoup4 library. Run this command in your terminal

```C
pip install beautifulsoup4
```

3. Install yfinance library. Run this command in your terminal
 
```C
pip install yfinance
```

4. Install pymongo library. Run this command in your terminal

```C
pip install pymongo
```

## 3.2 Functionalities of Yahoo Finance Crawler
---
### Cheemeng_yFinanceCrawler.py

#### 1. Importing libraries
```C
import requests
from bs4 import BeautifulSoup
import yfinance as yf
import validators
```
The program will be importing libraries which are requests, BeautifulSoup, yfinance, pymongo. Installation guide for these libraries are shown in 2.3.1 Prerequisites

Firstly, the program will import requests library to allow programs to send HTTP requests. This module will return a response object with all the response data. 

Secondly, the program will import BeautifulSoup from bs4. The use of BeautifulSoup allows the program to pull data out from HTML and XML files. The parser also will provide idiomatic ways of navigating, searching and modifying the parse tree

Thirdly, the program will import yfinance as yf. This library allows the program to send requests and receive results from Yahoo Finance API.

Lastly, the program will import pymongo. This library provide tools for program to interact with MongoDB

#### 2. YFinanceCrawler class
```C
class YFinanceCrawler():
    def __init__(self, symbol):      
        self.currentSymbol = symbol
```
Main program will create an class object to by passing a parameter call *symbol* into *self.currentSymbol*

##### 2.1 Crawl Historical data function
```C
    # Crawl historical data                    
    def getHistoricalData(self):
            print(self.currentSymbol)
            stock = yf.Ticker(self.currentSymbol)
            data = stock.history(period="max")
            data = data[["Open","High","Low","Close","Volume"]]
            data.reset_index(inplace=True)
            data = data.to_dict("records")
            data = list(data)

            # Check if data is in correct datatype
            i = 0
            while i < len(data):
                openValue = data[i]["Open"] #float
                openRes = isinstance(openValue, str)

                highValue = data[i]["High"] #float
                highRes = isinstance(highValue, str)

                lowValue = data[i]["Low"] #float
                lowRes = isinstance(lowValue, str)
                
                closeValue = data[i]["Close"] #float
                closeRes = isinstance(closeValue, str)

                volumeValue = data[i]["Volume"] #int
                volumeRes = isinstance(volumeValue, str)

                # Open value must be in float
                # If value is a string(true)
                if str(openRes) == "True":
                    openValue = 0.0
                # If value if not float
                elif type(openValue) != float:
                    print("Open: Value must be in float type")
                    openValue = float(openValue)
                
                # High value must be in float
                # If value is a string(true)
                if str(highRes) == "True":
                    highValue = 0.0
                # If value is not float
                elif type(highValue) != float:
                    print("High: Value must be in float type")
                    highValue = float(highValue)

                # Low value must be in float
                #If value is a string(true)
                if str(lowRes) == "True":
                    lowValue = 0.0
                # If value is not float
                elif type(lowValue) != float:
                    print("Low: Value must be in float type")
                    lowValue = float(lowValue)

                # Close value must be in float
                # If value is string(true)
                if str(closeRes) == "True":
                    closeValue = 0.0
                # If value is not float
                elif type(closeValue) != float:
                    print("Close: Value must be in float type")
                    closeValue = float(closeValue)
                
                i += 1

            return data
```
This method is to crawl historical data for stocks from Yahoo Finance.

Firstly, it will access the Ticker module which allows us to get ticker data. After that, we will set the period and what kind of value we want for historical data. 

After the program recieved historical data, the program will check if the values are in the correct datatype. If not, it will prompt message and convert the incorrect datatype into a correct datatype.

Lastly, we will return the historical data for current stock in a list.

##### 2.2 Get Parser function by using BeautifulSoup
```C
    # Using beautiful soup to create parser
    def getParser(self, url):
        #Check if baseUrl is a valid Url
        validUrl = validators.url(url)
        #If is a valid url
        if validUrl == True:
            #HTTP request to the Url
            r= requests.get(url)
            try:
                if r.status_code == 404:
                    raise Exception("HTTP URL not found")
            except Exception:
                print("Page not found")

            finally:
                #Creating BS object and instruct BS to use 'lxml' parser
                data=r.text
                soup=BeautifulSoup(data, 'lxml')
                return soup
        #If is invalid url
        else:
            print("Invalid url")
```
This method will take in url parameter from main program. The program will check if is a valid url. 
If the url is valid, it will send an HTTP request.

If is a invalid url, it will prompt "Invalid url" message.

After receiving the response object, it will instruct BeautifulSoup to use the lxml parser and create a BeautifulSoup object by using BeautifulSoup library.

##### 2.3 Crawl stocks name from Yahoo Finance
```C
    #Scrap all symbols from table
    for listing in soup.find_all('tr', attrs={'data-reactid':i}):
        #CC Symbol
        for tdSymbol in listing.find_all('td', attrs={'data-reactid':i+1}):
            for aSymbol in tdSymbol.find_all('a'):
                Symbol = aSymbol.find(text=True)
                #Add new symbol into array
                stockSymbol.append(Symbol)
    return stockSymbol
```
In this function, we will be searching the table which contains stocks symbols and scrap stocks symbols from the Yahoo Finance webpage by using the BeautifulSoup object. Everytime we find a stock symbol, we will insert the symbol into an array.

##### 2.4 Crawl historical data of Industries/Areas stocks 
```C
    def getIndustriesStockData(self, db):
        url = "https://sg.finance.yahoo.com/industries/" + self.currentSymbol
        for i in range(55,250,20):

            #Url of stock on YahooFinance            
            # Get BS object by requesting url
            soup = self.getParser(url)
            
            #get symbol for stock
            stockSymbol = self.getSymbol(i, soup)
            print(stockSymbol)

        #Crawl historical data for all stocks from yahoo finance
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
                callCrawlHistoricalData = YFinanceCrawler(currentStockSymbol)
                data = callCrawlHistoricalData.getHistoricalData()
                
                if len(data) != 0:
                    # fetch and insert data
                    new_collection.insert_many(data)
                else:
                    print("No Historical data")
            i += 1
```
In this function, we will crawl stock symbols from different industries depends on which industry that user want. In order to do that, we will be creating a BeautifulSoup object by sending HTTP requests to the Yahoo Finance website. After the object is created, we will start scraping the stock symbols from the website.
Then, we will check if the current stock is existing in the database. If current stock is not in the database, we will be creating a new collection and adding into the database. After that , the program will crawl historical data for current stock and add into the current collection. If there is no historical data for current stock, the program will print no historical data.


### Cheemeng_YF_UnitTesting.py
#### Unit Testing for Yahoo Finance Crawler
```C
import YfinanceCrawler as yfClasses
import unittest
import validators

def main():
    ########Test inputs for getParser()########

    # Test if url is valid
    invalidUrl = "asdfasdf"
    validUrl = "https://sg.finance.yahoo.com/industries/energy"
    testParser = yfClasses.YFinanceCrawler("")

    # Invalid url
    print(invalidUrl)
    testParser_invalid = testParser.getParser(invalidUrl)

    # Valid url
    print()
    print(validUrl)
    testParser_valid = testParser.getParser(validUrl)

    # testHistoricalData = yfClasses.YFinanceCrawler(symbol)


if __name__ == "__main__":
    main()
```
This is the unit testing for Yahoo Finance Crawler, it will insert invalid and valid url and create the object. If the url is invalid, it will prompt error message.

# 4. Twitter Crawler

Twitter crawler is a program that can crawl user's tweets from their user timeline. After the tweets are retrieved from the user's timeline, it will store the tweet and the date it is created into the respective database, represented by their stock name into mongodb.

## 4.1 Prerequisites

1. Install tweepy library. Run this command in command prompt.
```
pip install tweepy
```
Tweepy is a Python library to access the Twitter API which will be used to retrieve tweets from Twitter. Tweepy includes a set of classes and methods that represent Twitter’s models and API endpoints, and it handles implementation details.

2. Install pymongo. Run this command in command prompt.
```
pip install pymongo
```
Pymongo library is a Python Driver for MongoDB and is used to interact with MongoDB database from Python.


## 4.2 Functionalitiy of Twitter Crawler

### 1. Importing libraries
```
import tweepy 
import pymongo
```

### 2. Funtion to crawl tweets

Tweepy uses OAuth to to authenticate the request, therefore we need to create the authentication credentials using the Twitter Developer Account. The four credentials are consumer key, consumer secret key, access key and access secret key.

The function will run and get the twitter credentials that was generated from the twitter developer account and saved into api.txt file. Next, we used OAuthHandler to set the credentials to be used in all API calls and API to access the Twitter API's functionality.

We will be retrieving tweets from Twitter accounts owned by the stocks we want to monitor using user_timeline. We will firstly make intial request to get the most recent of the twitter account and save the most recent tweets to a list. Then, the function will check whether the account has tweets, if the account doesn not have tweets, it will return a empty list. If the account has tweets, it will save the id of the oldest tweet less one and use it in the user_timeline max_id parameter to prevent duplicate tweets. We can also filter if we want to include replies of the twitter account using exclude_replies parameter.

```
class crawlTweets():
    def __init__(self,username):
        self.username = username

    def get_all_tweets(self):
        
        #Twitter API credentials
        api=[]
        with open("api.txt", "r") as f:
            for line in f:
                api.append(line.strip())
        consumer_key = api[0]
        consumer_secret = api[1]
        access_key = api[2]
        access_secret = api[3]

       #authorize twitter, initialize tweepy
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_key, access_secret)
        api = tweepy.API(auth)

        #initialize a list to hold all the tweepy Tweets
        alltweets = []                                                                                                                          

        #make initial request for most recent tweets 
        new_tweets = api.user_timeline(screen_name = self.username,count=200,exclude_replies=True)
        #save most recent tweets
        alltweets.extend(new_tweets)

        #to check if the user has tweets
        if len(alltweets) == 0:
            return alltweets
        else:    
            #save the id of the oldest tweet less one
            oldest = alltweets[-1].id - 1

            #keep grabbing tweets until there are no tweets left to grab
            while len(new_tweets) > 0:
                #all subsiquent requests use the max_id param to prevent duplicates
                new_tweets = api.user_timeline(screen_name = self.username,count=200,max_id=oldest,exclude_replies=True)
                alltweets.extend(new_tweets)
                #update the id of the oldest tweet less one
                oldest = alltweets[-1].id - 1

        return alltweets
```


### 3. Main funtion 
In Main, we will first login to MongoDB using connectiontoMongoDb function and connect to the databse called "twitter". We will be saving the tweets of each account in the databse using their stock symbol. For example, for "amazon" screen name, it will be saved as "AMZN" into the database.
Then, we will check if the name of the stock is in the database, if there is no collection of the current stock, it will create a new collection and add it to the database. After the collection is created, it will run the crawlTweets function to retrieve tweets from the accounts and add it into the collection. If there is no tweets for the current account, it will print no historical data.

```
def main():
    login = []
    connectToMongoDb = connectionToMongoDb(login)
    client = connectToMongoDb.getConnectionToMongoDb()
    db = client["twitter"]
    existing_list = db.list_collection_names()

    count = 0
    while count < len(stock_names):
        try:
            if stock_names[count] not in existing_list:
                raise Exception("Account Not Found")
        except Exception:
            # create new collection
            print("Creating New Collection")
            current_screenname = str(screen_names[count])
            current_stockname = str(stock_names[count])
            print(current_stockname)
            new_collection = db[current_stockname]
            callCrawlHistoricalData = crawlTweets(current_screenname)
            data = callCrawlHistoricalData.get_all_tweets()
            
            if len(data) != 0:
                    #insert data into collections
                    for tweet in data:
                        new_collection.insert_one({
                        "tweet_text": tweet.text,
                        "tweet_created": tweet.created_at})
            else:
                print("No Historical data")     
        count+=1
	
if __name__ == "__main__":
    main()
	
```
# CSC1009-DataCrawler
CSC1009 Data Crawler Group Project

# 5. Reddit crawler

The Reddit crawler is a program used to retrieve posts from Reddit based on the subreddit entered. It can also be filtered based on the relevance(hot, top) as well time(day,week,month). After retrieving the posts, it will insert the date, title, and contents of each post into the database.

## 5.1 Prerequisites
---
For Reddit Crawler, there are some libraries needed to start.

1. Install PRAW. Run this command in command prompt

```C
pip install praw
```
2. Install pymongo. Run this command in command prompt

```C
pip install pymongo
```

## 5.2 Functionalities of Reddit Crawler
---
### RedditCrawler.py

#### 1. Importing libraries
```C
from datetime import datetime
import praw
import pymongo
```
The program will need 3 imported libraries. 
> datetime: To convert the value retrieved from the object into date & time.

> praw: The API that will be used to retrieve posts from reddit.

> pymongo: This is needed to establish a connection with MongoDB so that we can insert our Reddit posts.

#### 2. Authentication
Before we start, we need authentication to allow our crawler to roam through reddit and retrieve posts from subreddits. To do this:
1. Create/Login to your reddit account
2. Go and create a Reddit instance [HERE](https://www.reddit.com/prefs/apps)
3. Click on "create another app"


![image](https://user-images.githubusercontent.com/30068705/111768122-7ad99b80-88e2-11eb-90bc-e9c95f6f652e.png)

4. Enter details
```C
a. Fill up the name and description with whatever you want to name it.
b. For redirect uri, enter: http://localhost:8080
c. Click on "create app"
```
![image](https://user-images.githubusercontent.com/30068705/111768936-8bd6dc80-88e3-11eb-967c-2ccf5101ef3b.png)

5. Transfer authentication details to your code
```C
reddit = praw.Reddit(client_id='Enter client_id here', client_secret='Enter secret here', user_agent='Enter user_agent here')
```
![image](https://user-images.githubusercontent.com/30068705/111769789-934ab580-88e4-11eb-96ee-3c83c984aa12.png)

You now can start crawling from reddit.


#### 3. Find subreddit function
1. Find the hot 20 posts from Reddit
```C
def find_subreddit_hot(name):
    subrdt = reddit.subreddit(name).hot(limit=20)
    return subrdt
```
2. Find the top 20 posts of the day from Reddit
```C
def find_subreddit_top_day(name):
    subrdt = reddit.subreddit(name).top(time_filter='day', limit=20)
    return subrdt
```
3. Find the top 20 posts of the week from Reddit
```C
def find_subreddit_top_week(name):
    subrdt = reddit.subreddit(name).top(time_filter='week', limit=20)
    return subrdt
```
4. Find the top 20 posts of the month from Reddit
```C
def find_subreddit_top_month(name):
    subrdt = reddit.subreddit(name).top(time_filter='month', limit=20)
    return subrdt
```

These functions allow you to find 20 posts based from the hot or top of the day/week/month page. You can also change the time filters to year or all for the all time top posts. You can also get the newest posts as well depending on what you want. You can research more on PRAW [here](https://praw.readthedocs.io/en/latest/).


#### 4. Add to database function
1.This function allows you insert the date, title and body of the posts into the collection.
```
def add_db(subreddit, col):
    mylist = []
    for post in subreddit:
        doc = {"Date": str(datetime.fromtimestamp(post.created)), "Title": post.title, "Post": post.selftext}
        mylist.append(doc.copy())
    col.insert_many(mylist)
```
By creating an empty list, it will loop the entire listing of posts and add the date, title, and post into a dictionary and then add that dictionary into the list. The loop will go through all Reddit objects and at the end, it will have the list of all posts containing their date, title and body. This list will then be inserted into the collection of the database.


#### 5. Calling the functions
Now with the functions assembled. We can finally retrieve the posts and add them into our database.
1. Retrieving the posts
```C
stocks_posts_hot = find_subreddit_hot("Stocks")
stocks_posts_day = find_subreddit_top_day("Stocks")
stocks_posts_week = find_subreddit_top_week("Stocks")
stocks_posts_month = find_subreddit_top_month("Stocks")
```
This will get you the 20 posts from hot, top of day/week/month.

2. Connect to database
```C
# Create connect to MongoDB
client = connectionToMongoDB("reddit")
client = client.getCurrentDb()

# Create database
db = client["reddit"]
```
Connect to your database using your client connection and create a database.

3. Create your collections
```C
# Create collections
S_Col_hot = db["Stocks_hot"]
S_Col_top_day = db["Stocks_day"]
S_Col_top_week = db["Stocks_week"]
S_Col_top_month = db["Stocks_month"]
```
This will create the collections for you to insert your data into.

4. Finally to add your data into the database
```C
# Add into database
add_db(stocks_posts_hot, S_Col_hot)
add_db(stocks_posts_day, S_Col_top_day)
add_db(stocks_posts_week, S_Col_top_week)
add_db(stocks_posts_month, S_Col_top_month)
```
This will call the add_db() function that will retrieve the date, title, and post from each object in the list generator and add them into a list. The list is then inserted into the collection. Thus your data is now in the database.
