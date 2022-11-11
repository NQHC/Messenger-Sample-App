const e = require("express");
const express = require("express");
const router = express.Router();
require("dotenv/config");
const Queue = require("../schema/InChatQueue");
/* GET users listing. */

router.post("/", (req, res) => {
    //const{userId} = req.body;
    const {userId,tag1,tag2,tag3,reqtags} = req.body;
   if (reqtags == 'false'){
  //  for (var i = 0; i < )
    return res.status(200).json("false");
   }
   else{
    return res.status(200).json("true");
   }
    return res.status(200).json({reqtags});
})

module.exports = router;
