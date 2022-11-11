const e = require("express");
const express = require("express");
const router = express.Router();
require("dotenv/config");
const Queue = require("../schema/InChatQueue");
/* GET users listing. */

router.post("/", (req, res) => {
   

    const tags = []; 
   
    const {userId,tag1,tag2,tag3,reqtags} = req.body;
    if (!userId){
      return res.status(400).json({ msg: "Did not send User Id" });
    }
    if (tag1){
      tags.push(tag1);
    const first =  Queue.findOne({tags: tag1})
    if (first){
    //  createChat(userId,first);
      res.status(200).json({msg: "Success Tag1"});
    }
    }
    if(tag2){
      tags.push(tag2);
      const second =  Queue.findOne({tags: tag2});
      if (second){
     //   createChat(userId,first);
        res.status(200).json({msg: "Success Tag2"});
      }
    }
    if(tag3){
        tags.push(tag3);
      const third =  Queue.findOne({tags: tag3});
      if (third){
      //  createChat(userId,first);
        res.status(200).json({msg: "Success Tag3"});
      }
    }
    const user2Id =   Queue.findOne({});
    if (user2Id){
      //createchat (userId,user2Id);
      res.status(200).json({msg: "Success"});
    }
    else{
      const inQueue = new Queue({
        user: userId,
        tags: tags
    })
      inQueue.save();
    }
    

   //if (reqtags == 'false'){
  //  for (var i = 0; i < )
    //return res.status(200).json("false");
   //}
   //else{
    //return res.status(200).json("true");
   //}
    //return res.status(200).json({reqtags});
})

module.exports = router;
