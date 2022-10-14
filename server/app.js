const app = require("express")();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

http.listen(8080, () => console.log("Server is running..."));

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
