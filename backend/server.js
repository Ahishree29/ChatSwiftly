const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
const express = require("express");
const colors = require("colors");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRouters");
const chatRoutes = require("./routes/chatRouters");
const messageRouters = require("./routes/messageRouters");
const notification = require("./routes/notificationRouters");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const httpServer = http.createServer(app);
connectDB();
const port = process.env.PORT || 5000;
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRouters);
app.use("/api/notification", notification);
//--------------------Deployment---------------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running");
  });
}
//--------------------Deployment---------------------------

app.use(notFound);
app.use(errorHandler);
httpServer.listen(
  port,
  console.log(`server Started on Port ${port}`.yellow.bold)
);
// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });
const io = new Server(httpServer);
io.on("connection", (socket) => {
  console.log("connection to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user Joined room", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageRecived) => {
    var chat = newMessageRecived.chat;
    if (!chat.users) return console.log("chat is not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecived.sender._id) return;
      socket.in(user._id).emit("message recived", newMessageRecived);
    });
  });
  socket.off("setup", () => {
    console.log("user Disconnected");
    socket.leave(userData._id);
  });
});
