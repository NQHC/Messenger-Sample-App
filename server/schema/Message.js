const mongoose = require("mongoose");

const MessageSchema =  mongoose.Schema({
    message: String,
    chatId: {type: mongoose.Schema.ObjectId, ref :"Chat"},
    sentBy: {type: mongoose.Schema.ObjectId, ref :"User"},
    message_number: Number,
}) 
module.exports = mongoose.model("message", MessageSchema);