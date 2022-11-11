const mongoose = require("mongoose");

const InQueue = mongoose.Schema({
  user:  {type: mongoose.Schema.ObjectId, ref :"User"},
  tags: {
    type: Array,
    default: [String],
  },
  reqtags: {
    type:Boolean,
    default: false,
  },
});

module.exports = mongoose.model("InQueue", InQueue);
