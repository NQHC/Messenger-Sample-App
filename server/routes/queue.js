const e = require("express");
const express = require("express");
const router = express.Router();
require("dotenv/config");
const Queue = require("../schema/InChatQueue");
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
        return res.status(200).json({msg:"Added to Queue"})
      }
      else{
        console.log("In Queue" + queue);
        user2 = queue.user;
        user1 = userId;
        const body = {user1, user2}
        axios.post("http://localhost:8080/chat/createChat",body)
        .then(()=>{
          queue.remove();
          return res.status(200).json({msg:"Already in Queue"});
            
        })
        .catch((err)=>{
            console.log(err);
            return res.status(400).json({msg:"Error creating chat"});
        });
      }
    })
    .catch(err => {
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
