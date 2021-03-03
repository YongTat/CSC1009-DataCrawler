const express =require('express');
const router = express.Router();
const Twitter = require('../models/twitter_model')
const mongoose = require('mongoose');

//Get all the post
router.get('/', async (req,res) => {
    try{
      const tweet = await Twitter.find();
      res.json(tweet);
      console.log(tweet);
    }
    catch(err){
      res.json({message:err});
    }


  });

module.exports = router;