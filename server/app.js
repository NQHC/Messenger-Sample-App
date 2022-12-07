

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv/config");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());
const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.set('socketio',io);

const userRoute = require("./routes/users");
const chatRoute = require("./routes/chatInstance");
const queueRoute = require("./routes/queue");
const adminRoute = require("./routes/admin");

app.use("/queue",queueRoute);
app.use("/users",userRoute);
app.use("/chat",chatRoute);
app.use("/admin",adminRoute);



mongoose.connect(process.env.DATABASE_URL, {
  serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));

 
 




app.get("/", (req, res) => {
  res.send("Server Response");
  
});

io.on("connection", (socket) => {
  
  console.log("Test");
  console.log("ID is :" + socket.id)

  socket.on("in_room",(roomId) => {
    console.log("Joined + " + roomId)
    socket.join(roomId);
  });
  socket.on("out_chat",(chatId) => {
    //console.log("Left + " + chatId)
    socket.leave(chatId);
  });

  socket.on("send_message", (data) => {
    console.log(data.roomNumbers);
    console.log(data.message);
    socket.to(data.roomNumbers).emit("reply_message", data.message);
  });
  
 
});
http.listen(8080, () => console.log("Server is running..."));