const express = require("express");
const app = express();
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config')

//Middleware
app.use(cors());
app.use(bodyParser.json());

//import Routes
const stockRoutes = require('./routes/stock');
const tweeterRoutes = require('./routes/twitter');

//Everytime goes to posts, use postRoutes

app.use('/stock',stockRoutes);
app.use('/twitter',tweeterRoutes);

//ROUTES
app.get('/',(req,res) => {
   res.send('We are on home');
})

app.get('/stock',(req,res) => {
  res.send('We are on stock');
})


//Connection to Database

mongoose.connect(process.env.DB_CONNECTION, 
{ useNewUrlParser: true },
() => console.log('Connected to DB'));


//How do we start listening to the server

app.listen(3000);
