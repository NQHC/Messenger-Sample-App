const e = require("express");
const express = require("express");
const router = express.Router();
require("dotenv/config");
const Queue = require("../schema/InChatQueue");
const Tag = require("../schema/Tag");
const axios = require('axios');
/* GET users listing. */

router.post("/", async (req, res) => {
    const userId = req.body.userId;
    
    const tags = req.body.tags;
    if (!userId){
      return res.status(400).json({ msg: "Did not send User Id" });
    }
    await Queue.findOne({tags: {$in : tags}})
    .then(queue => {
      if(!queue){
        console.log("Not in Queue");
        const inQueue = new Queue({
          user: userId,
          tags: tags
        })
        inQueue.save();
        options = { upsert: true, new: true, setDefaultsOnInsert: true };
        update = {$inc: {'current' : 1}};
        console.log("Updating Tag");
     //   for (i of tags){
        Tag.findOneAndUpdate({tagstr: "a"},update,options,function(error,result){
          if (error){
            console.log("error");
            return res.status(400).json({msg:"Error with tags"})
          }
          else{
            console.log("success")
            return res.status(200).json({msg:"Added to Queue"})
          }
        })
     //   };
        console.log("Did Tag");
       
      }
      else{
        console.log("In Queue" + queue);
        user2 = queue.user;
        user1 = userId;
        var body = {user1, user2}
         axios.post("http://localhost:8080/chat/createChat",body)
        .then(()=>{
          queue.remove();
          id = user2;
          QueueStatus = false; 
          body = {QueueStatus,id};
          axios.put("http://localhost:8080/users/toggleQueue",body)
          .then(()=> {
            id = user1;
            body = {QueueStatus,id};
            axios.put("http://localhost:8080/users/toggleQueue",body)
            .then(()=>{
              return res.status(200).json({msg:"Created Chat"});
            })
            .catch((err)=>{
              console.log(err);
              return res.status(400).json({msg:"Error toggling user1"});
            })
          })
          .catch((err)=>{
            console.log(err);
            return res.status(400).json({msg:"Error toggling user2"});
          })
        

      //    return res.status(200).json({msg:"Already in Queue"});
            
        })
        .catch((err)=>{
            console.log(err);
            return res.status(400).json({msg:"Error creating chat"});
        });
      }
    })
    .catch(err => {
      console.log("ERROR");
      return res.status(400).json({err});
    })
})
router.delete("/del",async (req,res)=>{
  const {id} = req.body;
  await (Queue.findOne({user : id}))
    .then(user=>user.remove())
    .then(user =>
      res.status(201).json({msg: "User deleted from Queue",user})
    )
    .catch(error =>
      res.status(400).json({msg:"An error occured(user not found)",error:error.msg})
    )
})
module.exports = router;
