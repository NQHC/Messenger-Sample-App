const e = require("express");
const express = require("express");
const router = express.Router();
require("dotenv/config");
const Queue = require("../schema/InChatQueue");
const Chat = require("../schema/Chat");
const Message = require("../schema/Message");
const User = require("../schema/User");

router.get('/usermessages', function(req, res) {
    const  {userId} = req.query; 
    if (!userId){ // if chat id was not sent 
        return res.status(400).json({ msg: "Did not send User Id" });}
    Message.find({ sentBy : userId}, (err, userMessages)=>{
            if (err){
                return res.status(400).json({ msg: "No Messages found" });}
            var messages = {};
            messages = userMessages.map((n=>n));
           
            res.status(200).json({ messages });
  });
});
module.exports = router;
