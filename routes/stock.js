const express =require('express');
const router = express.Router();
const Stock = require('../models/stock_model')
const mongoose = require('mongoose');

//Get all the post
router.get('/', async (req,res) => {
    try{
      const stock = await Stock.find();
      res.json(stock);
      console.log(stock);
    }
    catch(err){
      res.json({message:err});
    }

    // Stock.find(function(err, doc) {
    //   console.log(doc)
    //   if (err) return console.error(err);
    //   console.log("Document inserted succussfully!");
    // });
  });

//Get Specific Post
router.get('/:id', async (req,res)=>{
  try{
    const stock = await Stock.findById(req.params.id);
    res.json(stock);
  }
  catch(err){
    res.json(err);
  }
})

//Submit Post
router.post('/', async(req,res)=>{
  console.log(req.body);
  const stock = new Stock({
    date: req.body.date,
    high: req.body.high,
    low: req.body.low,
    open: req.body.open,
    close: req.body.close,
    volume: req.body.volume
  });

    stock.save(function(err, doc) {
      if (err) return console.error(err);
      console.log("Document inserted succussfully!");
    });

});

//Delete Stock 
router.delete('/:id', async (req,res)=> {
  try{
  const removeStock = await Stock.remove({_id:req.params.id});

  }
  catch (err){
    console.log("Error in Deleting Post");
  }
})

//Update Stock
router.patch('/:id', async (req,res)=> {
  try{
  const updateStock = await Stock.updateOne({_id:req.params.id},{$set:{high: req.body.high}});
  res.json(updateStock);
}
  catch (err){
    console.log("Error in Deleting Post");
  }
})

module.exports = router;