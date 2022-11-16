const express = require("express");
const router = express.Router();
require("dotenv/config");
const bcrypt = require ("bcryptjs")
const User = require("../schema/User");
/* GET users listing. */

router.post("/", (req, res) => {
  const {email,password} = req.body
  console.log(email);
  if (!email || !password){
    console.log("Error");
    return res.status(400).send({ msg: "Please enter all fields" });
  }
  // Email Validation
  const emCheck =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emCheck.test(email)) {
    return res.status(400).json({ msg: "Invalid email" });
  }
  // Password Validation
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password should be 6 or more characters" });
  }
  User.findOne({email}).then((user)=>{
    if (user){
      console.log("In use");
      return res.status(400).json({msg: "Email already in use"});
    }
    const newUser = new User({
      email,
      password
    });
    bcrypt.hash(password,10).then(async (hash)=>{
      newUser.password = hash;
      newUser.save().then((user)=> {
        return res.json({
          user: {
            id: user.id,
            email: user.email,
            chats: user.chats,
          }
        })
    })
    });
   
  });
 
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      return res.json({
        user: {
          id: user.id,
          email: user.email,
          chats: user.chats
        },
      })
    })}
  )});

router.delete("/del",async(req,res)=>{
  const {id} = req.body;
  await (User.findById(id))
    .then(user=>user.remove())
    .then(user =>
      res.status(201).json({msg: "User deleted",user})
    )
    .catch(error =>
      res.status(400).json({msg:"An error occured",error:error.msg})
    )
})

router.put("/update",async(req,res,next)=> {
  const{role,id} = req.body;
  if (role && id){
    if(role === "admin"){
      await User.findById(id)
      .then((user) => {
        if (user.role !== "admin"){
          user.role = role;
          user.save((err)=> {
            if(err){
              res.status("400").json({msg:"Error Occured",error:err.msg});
              process.exit(1);
            }
            res.status("201").json({msg:"Update Successful",user});
          });
        } else{
          res.status("400").json({msg:"User already an Admin"});
        }
      })
      .catch((error)=> {
        res.status("400").json({msg:"Error Occured",error:error.msg});
      })
    }
  }
})
module.exports = router;
