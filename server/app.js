

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

const userRoute = require("./routes/users");
const chatRoute = require("./routes/chatInstance");
const queueRoute = require("./routes/queue");

app.use("/queue",queueRoute);
app.use("/users",userRoute);
app.use("/chat",chatRoute);


const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
mongoose.connect(process.env.DATABASE_URL, {
  serverSelectionTimeoutMS: 5000
}).catch(err => console.log(err.reason));

 //   useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useFindAndModify: false,
    //useCreateIndex: true,
 




app.get("/", (req, res) => {
  res.send("Socket.io");
  
});

io.on("connection", (socket) => {
  socket.emit("Socket_ID",socket.id)
  console.log("Test");
  console.log("ID is :" + socket.id)
  socket.join("socket.id");

  socket.on("send_message", (data) => {
    console.log(data.roomNumbers);
    console.log(data.message);
    socket.to(data.roomNumbers).emit("reply_message", data.message);
  });
  
 
});
http.listen(8080, () => console.log("Server is running..."));