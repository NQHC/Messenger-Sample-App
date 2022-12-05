const mongoose = require("mongoose");

const TagSchema =  mongoose.Schema({
    tagstr: {
        type: String,
        required: true,
    },
    popular:{
        type: Number,
        default: 0,
    },
    current:{
        type:Boolean,
        default: false,
    },
}) 
module.exports = mongoose.model("tag", TagSchema);