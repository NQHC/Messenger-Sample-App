const express = require("express");
const router = express.Router({ mergeParams: true });
require("dotenv/config");


const Chat = require("../schema/Chat");
const Message = require("../schema/Message");
const User = require("../schema/User");
/* GET users listing. */

router.get("/", (req, res) => {
    const  {chatId,total} = req.query; // chat id and total from query
    if (!chatId){ // if chat id was not sent 
        return res.status(400).json({ msg: "Did not send chat Id" });}
   
      Chat.findById(chatId,(err,thisChat) => {
      if (err){
        return res.status(400).json({ msg: "No chat instance found" });}
        
        if (!total){ // if new request set total messages to chat room's total
        currM = thisChat.total_messages;
        }
        else {
            currM = total;
        }
        const quantity = 10;   
         Message.find({ // get last 10 messages
            chatId, 
            message_number: 
                { $lte: currM , $gt: currM-quantity} // return 10 messages
        }, (err, theseM)=>{
            if (err){
                return res.status(400).json({ msg: "Start a conversation" });}
            var messages = {};
            messages = theseM.map((n=>n));
           
            res.status(200).json({ messages });
        })
       
    });
});

router.post("/createMessage",(req,res)=>{
    const{message,chatId,sentBy} = req.body;
    console.log(req.body);
    Chat.findById(chatId,(err,thisChat) => {
        if (err){
          return res.status(400).json({ msg: "No chat instance found" });}
        console.log(thisChat);
        console.log(thisChat.total_messages);
        total = thisChat.total_messages+1;
       
        const newMessage = new Message({
            message: message,
            chatId : chatId,
            sentBy : sentBy,
            message_number : total,
        })
        newMessage.save();
        thisChat.total_messages = total;
        thisChat.save();
      return res.status(200).json({msg: "Success"});
    })
 
});



router.post("/createChat",(req,res)=>{
    const{user1,user2,} = req.body
    const Users = [user1,user2];
    const newChat = new Chat({
        users: Users,
    })
    for (i = 0; i <2; i++){
        User.findById(Users[i],(err,user)=> {
            if (err){
                return res.status(400).json({msg: "User1 not found: "})
            }
            user.chats.push(newChat._id);
            user.save();
        })
    }
   
    newChat.save();
    return res.status(200).json({msg : newChat._id + "\n" + newChat.users[0] + " " + newChat.users[1]});
});
 



module.exports = router;
