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
        update = {'current' : true};
        console.log("Updating Tag");
        for ( var i = 0; i < tags.length;i++){
          Tag.findOneAndUpdate({tagstr: tags[i] },update,options,function(error,result){
            if (error){
              console.log("error w/ tags");
            }
          })
        }
        return res.status(200).json({msg:"Added to Queue"})
  
      }
      else{
        console.log("In Queue" + queue);
        update = {'current' : false};
        Tag.updateMany({tagstr: {$in : queue.tags }},update,function(error,result){
          if (error){
            console.log("error w/ decrementing current tags");
          }
        })
        update =  {$inc : {'popular' : 1}};
        const matchtags = tags.filter(element => queue.tags.includes(element));
        Tag.updateMany({tagstr: {$in : matchtags }},update,function(error,result){
          if (error){
            console.log("error w/ incrementing popular tags");
          }
        })
       
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
    .then(user=>{
      Tag.updateMany({tagstr: {$in : user.tags }},{'current' : false},function(error){
        if (error){
          console.log("error w/ setting tags to false");
        }
      })
      Tag.deleteMany({current: false, popular : 0},function(error){
        if (error){
          console.log("error w/ deleting tags");
        }
      })
      user.remove()
    })
    .then(user =>
      res.status(201).json({msg: "User deleted from Queue",user})
    )
    .catch(error =>
      res.status(400).json({msg:"An error occured(user not found)",error:error.msg})
    )
})
router.get("/tags", async (req, res) => {
    
  const activeTags = await Tag.find({current: true}).sort('-popular').limit(15);
  const popTags = await Tag.find({current : false}).sort('-popular').limit(30-activeTags.length);
  let result = activeTags.concat(popTags);
  return res.status(200).json(result);
});
module.exports = router;
