const _values = require('lodash/values')
const express = require("express");
const socketIO = require("socket.io");

const port = process.env.PORT || 8081;
const app = express();

const server = require("http").Server(app);

const bodyParser = require("body-parser");
const cors = require("cors");

const io = (module.exports.io = socketIO(server));
app.use(express.static(__dirname + "/build"));
app.use(cors());

let cells = Array(100)
  .fill()
  .map(() => Array(100).fill({ col: "green" }));

const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const CellState = new Schema({
  col: 'String'
})
const StateSchema = new Schema({
  time: {
    type: String
  },
  state: [[CellState]]
});

const State = mongoose.model("state", StateSchema);

mongoose.connect(process.env.MONGODB_URI, function(error) {
  if (error) console.error(error);
  else console.log("mongo connected");
});

io.on("connection", socket => {
  io.sockets.emit("init", { cells });

  State.find()
    .sort("-time")
    .limit(1)
    .exec((err, state) => {
      if (!err && state.length > 0) {
        console.log("TCL: state", state[0].id);
        cells = state[0].state;
        io.sockets.emit("init", { cells:state[0].state });
      }
    });

  socket.on("disconnect", () => {
    console.log("TCL: 'disconnect'", "disconnect");
  });
  socket.on("flip box", ({ x, y, color }) => {
    cells[x][y] = { col: color };
    io.sockets.emit("flip box", { x, y, value: cells[x][y] });
    const state = new State();
    state.state = cells;
    state.time = new Date().getTime();
    state.save();
  });

  socket.on("undo", async steps => {
    try {

      const findAndDelete = await State.findOneAndDelete({}, {"sort": {"_id": -1}}).exec()
      // console.log("TCL: findAndDelete", findAndDelete)
      const state = await State.find()
        .sort("-time")
        .limit(1)
        .exec();
      console.log("TCL: state", state._id);
      cells = state[0].state;
      io.sockets.emit("init", { cells:state[0].state });
    } catch (err) {
      console.log("TCL: err", err)
    }
  });
});

server.listen(port, () => {
  console.log("TCL: port", port);
});
