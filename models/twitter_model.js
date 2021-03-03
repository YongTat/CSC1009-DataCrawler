const mongoose = require('mongoose');

const TwitterSchema = mongoose.Schema({
    username: {
        type: String, 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    timestamp: {
        type: String, 
        required: true
    },
    content: {
        type: String, 
        required: true
    }
},{
    versionKey: false
})

module.exports=mongoose.model('Twitter', TwitterSchema, "twitter");