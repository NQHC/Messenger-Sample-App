const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type:String,
    default: "basic",
  },
  chats: [{type: mongoose.Schema.ObjectId, ref :"Chat"}],
  queuestatus: {
    type : Boolean,
    default : false
  },
  username: {
    type : String,
  },
  realName: {
    type : String,
    required : true,
  },
  secure : {
    type : String,
    requried : true,
  },
  secureAns : {
    type : String,
    required : true,
  }
});

module.exports = mongoose.model("user", UserSchema);
