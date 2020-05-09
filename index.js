const express = require("express");
const sck = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
const io = sck(
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  })
);

io.on("connection", (socket) => {
  console.log(
    `Socket ${socket.id} has connected from address ${socket.handshake.address}.`
  );

  socket.on("move", (payload) => {
    console.log("token moved");
    socket.broadcast.emit("moved", payload);
  });

  socket.on("delete", (payload) => {
    console.log("token deleted");
    socket.broadcast.emit("deleted", payload);
  });

  socket.on("resize", (payload) => {
    console.log("token resized");
    socket.broadcast.emit("resized", payload);
  });
});
