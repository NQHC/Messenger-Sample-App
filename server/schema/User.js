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
  role: {
    type:String,
    default: "basic",
  },
  chats: [{type: mongoose.Schema.ObjectId, ref :"Chat"}],
});

module.exports = mongoose.model("user", UserSchema);
