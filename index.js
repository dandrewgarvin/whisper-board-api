const express = require("express");
const sck = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");

const { splitLocation } = require("./utils/splitLocation");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
const io = sck(
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  })
);

// ========== STATEFUL TOKEN LIST ========== //
let tokens = [];

io.on("connection", (socket) => {
  console.log(
    `Socket ${socket.id} has connected from address ${socket.handshake.address}.`
  );

  socket.emit("startup", tokens);

  socket.on("move", (payload) => {
    console.log("token moved");

    if (payload.from) {
      // update existing token in list
      tokens = tokens.map((tkn) => {
        if (
          tkn.position.col === payload.from.col &&
          tkn.position.row === payload.from.row
        ) {
          return {
            ...payload.meta,
            position: payload.to,
          };
        } else {
          return tkn;
        }
      });
    } else {
      // add new token to list
      tokens.push({
        ...payload.meta,
        position: payload.to,
      });
    }

    socket.broadcast.emit("moved", payload);
  });

  socket.on("delete", (payload) => {
    console.log("token deleted");

    const { col, row } = splitLocation(payload);

    tokens = tokens.filter((tkn) => {
      if (tkn.position.col === col && tkn.position.row === row) {
        return false;
      }

      return true;
    });

    socket.broadcast.emit("deleted", payload);
  });

  socket.on("resize", (payload) => {
    console.log("token resized");

    tokens = tokens.map((tkn) => {
      if (
        tkn.position.col === payload.col &&
        tkn.position.row === payload.row
      ) {
        tkn.size = payload.size;
      }

      return tkn;
    });

    socket.broadcast.emit("resized", payload);
  });

  socket.on("rename", (payload) => {
    console.log("token renamed");

    tokens = tokens.map((tkn) => {
      if (
        tkn.position.col === payload.position.col &&
        tkn.position.row === payload.position.row
      ) {
        tkn.name = payload.name;
      }

      return tkn;
    });

    socket.broadcast.emit("renamed", payload);
  });
});
