const express = require("express");
const router = express.Router();
require("dotenv/config");
const bcrypt = require("bcryptjs")
const User = require("../schema/User");
const e = require("express");
/* GET users listing. */

router.post("/", async (req, res) => {
  const { email, password,password2, phone, firstName, lastName, secure, secureAns } = req.body
  console.log(email);
  if (!email || !password || !phone || !firstName || !lastName || !secure || !secureAns || !password2 ) {
    console.log("Error");
    return res.status(400).send({ msg: "Please enter all fields" });
  }
  // Email Validation
  const emCheck =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emCheck.test(email)) {
    return res.status(400).json({ msg: "Invalid email" });
  }
  const phCheck = /^[0-9\b\+\-\(\)]+$/;
  if (!phCheck.test(phone) || phone.length < 10) {
    return res.status(400).json({ msg: "Invalid Phone Number" });
  }
  // Password Validation
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password should be 6 or more characters" });
  }
  if (password !== password2){
    return res.status(400).json({ msg: "Passwords do not Match" });
  }
  
  if (firstName.length < 2 || lastName.length < 2) {
    return res.status(400).json({ msg: "Name should be longer" });
  }
  if (secure == "0" || secureAns.length<2){
    return res.status(400).json({ msg: "Issue with Security Fields" });
  }
  const realName = firstName + " " + lastName;
  User.findOne({ email }).then((user) => {
    if (user) {
    //  console.log("In use");
      return res.status(400).json({ msg: "Email already in use" });
    }
    const newUser = new User({
      email,
      password,
      phone,
      secure,
      secureAns,
      realName
    });
    bcrypt.hash(password, 10).then(async (hash) => {
      newUser.password = hash;
      newUser.save().then((user) => {
        return res.json({
          user: {
            id: user.id,
            email: user.email,
            chats: user.chats,
            realName: user.realName,
            username: user.username,
            phone: user.phone,
          }
        })
      })
    });

  });

});

router.post("/login", async (req, res) => {
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
          chats: user.chats,
          queuestatus: user.queuestatus,
          phone: user.phone,
          username: user.username,
          role: user.role,
          realName: user.realName,
        },
      })
    })
  }
  )
});

//Does not delete connected chats, use with caution
router.delete("/del", async (req, res) => {
  const { id } = req.body;
  await (User.findById(id))
    .then(user => user.remove())
    .then(user =>
      res.status(201).json({ msg: "User deleted", user })
    )
    .catch(error =>
      res.status(400).json({ msg: "An error occured", error: error.msg })
    )
})

router.put("/update", async (req, res, next) => {
  const { role, id } = req.body;
  if (role && id) {
    if (role === "admin") {
      await User.findById(id)
        .then((user) => {
          if (user.role !== "admin") {
            user.role = role;
            user.save((err) => {
              if (err) {
                res.status("400").json({ msg: "Error Occured", error: err.msg });
                // process.exit(1);
              }
              res.status("201").json({ msg: "Update Successful", user });
            });
          } else {
            res.status("400").json({ msg: "User already an Admin" });
          }
        })
        .catch((error) => {
          res.status("400").json({ msg: "Error Occured", error: error.msg });
        })
    }
  }
})
router.put("/toggleQueue", async (req, res, next) => {
  const { id, QueueStatus } = req.body;
  await User.findById(id)
    .then((user) => {
      user.queuestatus = QueueStatus;
      user.save((err) => {
        if (err) {
          res.status("400").json({ msg: "Error Occured", error: err.msg });
          // process.exit(1);
        }
        else {
          var io = req.app.get('socketio');
          io.to(id).emit('qToggle');
          res.status("201").json({ msg: "Toggled Successful,", user });
        }
      });

    })
    .catch((error) => {
      res.status("400").json({ msg: "Error Occured", error: error.msg });
    })
})
router.get("/chats", async (req, res) => {
  const { userId } = req.query; // user id from query

  if (!userId) { // if chat id was not sent 
    return res.status(400).json({ msg: "Did not send user Id" });
  }

  await User.findById(userId)
    .then((user) => {
    //  console.log("\nuser:" + userId + "\nchats: " + user.chats)
      return res.json({
        chats: user.chats,
      })
    })
    .catch((err) => {
      return res.status(400).json({ msg: "User not found" });
    })
});
router.get("/queueStatus", async (req, res) => {
  const { userId } = req.query; // user id from query
  if (!userId) { // if chat id was not sent 
    return res.status(400).json({ msg: "Did not send user Id" });
  }

  await User.findById(userId)
    .then((user) => {
      return res.json({
        queuestatus: user.queuestatus,
      })
    })
    .catch((err) => {
      return res.status(400).json({ msg: "User not found" });
    })
});
router.post("/username", async (req, res) => {
  const { DisplayName, id } = req.body;
  // Simple validation
  if (!DisplayName || !id) {
    return res.status(400).json({ msg: "Error" });
  }
  // Check for existing user

  await User.findOne({ _id: id }).then((user) => {
    user.username = DisplayName;
    user.save((err) => {
      if (err) {
        res.status("400").json({ msg: "Error Occured", error: err.msg });
      }
      else {
    //    console.log(user.username);
        return res.json({
          username: user.username,
        })
      }
    })
  })
    .catch((err) => {
      res.status("400").json({ msg: "Error Occured", err });
    })

});
module.exports = router;
