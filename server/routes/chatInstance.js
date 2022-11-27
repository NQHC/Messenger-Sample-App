const { application } = require("express");
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
        const quantity = 20;   
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
router.delete("/delMessage",async (req,res)=>{
    const{chatId,message_number} = req.body;
 
    console.log(chatId + "    " + message_number);
    await Message.findOne({chatId : chatId, message_number: message_number}) // delete message
    .then((msg)=>{
      
        msg.remove();
    })
    .catch((err)=>{
       console.log("Error encountered with Message: " + err);
    });
 
    await (Chat.findOneAndUpdate({_id : chatId,total_messages : {$gt : 0}},{$inc: {'total_messages' : -1}}))
    .catch((err)=>{
       console.log("Error with chat: " + err);// check if chat exists and has messages
    }
    )
    
   
    await Message.updateMany({message_number: {$gt: message_number},chatId:chatId} ,{$inc: {'message_number' : -1}}) // increment count of messages above input down one so they are still in order
    .then(()=>{
        return res.status(200).json({msg: "Success"});  
    })
    .catch((err)=>{
        return res.status(400).json({msg: "Error Encountered with Messages",err});
    })
  
    
      
   
  
 
});
router.post("/editMessage",async (req,res)=>{
    const{chatId,message_number,updatedMessage} = req.body;
    if (!chatId || !message_number || !updatedMessage){
        return res.status(400).json({msg: "Incorrect Input"});  
    }
    await Message.findOneAndUpdate({chatId : chatId, message_number: message_number},{message: updatedMessage}) // delete message
    .then(()=>{
        return res.status(200).json({msg: "Message is now " + updatedMessage});  
       
    })
    .catch((err)=>{
        return res.status(400).json({msg: "Error encountered finding message"}); 
    });
 
   
    
  
});

router.post("/createChat",(req,res)=>{
    const{user1,user2,} = req.body
    const Users = [user1,user2];
    const newChat = new Chat({
        users: Users,
    })
    console.log(user1 + "\n" + user2);
    for (i = 0; i <2; i++){
        User.findById(Users[i],(err,user)=> {
            if (err){
                console.log("User not found");
                return res.status(400).json({msg: "User1 not found: "})
            }
            user.chats.push(newChat._id);
            user.save();
        })
    }
   
    newChat.save();
    return res.status(200).json({msg : newChat._id + "\n" + newChat.users[0] + " " + newChat.users[1]});
});
 
router.delete("/delChat",async (req,res)=>{
    const {id} = req.body;
    await (Chat.findById(id))
    .then((chat) => {
            User.updateMany({'_id' : {$in:[chat.users[0],chat.users[1]]}},
                {$pullAll : { chats : [id] }} ,(err)=>
                {
                    if (err){
                        console.log("User Update Error")
                    }
                }
              );
            Message.deleteMany({chatId : id},(err)=> {
                if (err){
                console.log("Message deletetion Error");
                }
            }) 
           chat.remove();
    })
    .then(chat =>{
        return res.status(201).json({msg: "Chat deleted",chat});
    })
    .catch(err => {
        return res.status(400).json({msg: "Error Encountered",err});
    })
    
  })

module.exports = router;
