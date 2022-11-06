const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
  users: [{type: mongoose.Schema.ObjectId, ref :"User"}],
  total_messages:{
    type: Number,
    default: 0,
  } ,
});

module.exports = mongoose.model("chat", ChatSchema);
