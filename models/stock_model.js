const mongoose = require('mongoose');

const StockSchema = mongoose.Schema({
    date: {
        type: String, 
        required: true
    },
    high: {
        type: String,
        required: true
    },
    low: {
        type: String, 
        required: true
    },
    open: {
        type: String, 
        required: true
    },
    close: {
        type: String, 
        required: true
    },
    volume: {
        type: String, 
        required: true
    }
},{
    versionKey: false
})

module.exports=mongoose.model('Stock', StockSchema, "StockData");