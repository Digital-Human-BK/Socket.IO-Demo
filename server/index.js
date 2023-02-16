const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
// const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected!");

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", (data) => {
    if (data.room === "") {
      socket.broadcast.emit("receive_message", data);
    } else {
      socket.to(data.room).emit("receive_message", data);
    }
  });
});

server.listen(3030, () => {
  console.log("Server is running on port 3030!");
});
