const mongoose = require("mongoose");

const TagSchema =  mongoose.Schema({
    tagstr: String,
    popular:{
        type: Number,
        default: 0,
    },
    current:{
        type:Number,
        default: 0,
    },
}) 
module.exports = mongoose.model("tag", TagSchema);