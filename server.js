const express = require('express')
const socketIO = require('socket.io')

const port = process.env.PORT|| 8081
const app = express()

const server = require('http').Server(app)

const bodyParser = require('body-parser');
const cors = require('cors');

const io = module.exports.io = socketIO(server)
app.use(express.static(__dirname + '/build'))
app.use(cors());

let cells = Array(100).fill().map(() => Array(100).fill({col:'green'}))

const mongoose = require('mongoose')


const Schema = mongoose.Schema;
const StateSchema = new Schema({
  time: {
    type: String,
  },
  state: {
    ofArrays: [[]]
  },
});

const State = mongoose.model('state', StateSchema);

mongoose.connect(process.env.MONGOLAB_URI, function (error) {
  if (error) console.error(error);
  else console.log('mongo connected');
});

io.on('connection', socket => {
  io.sockets.emit('init', { cells })

  State.find().sort('-time').limit(1).exec((err, state) => {
    if (!err && state.length > 0) {
      console.log("TCL: state", state[0].id)
      const cvt = JSON.stringify(state[0].state)
      const prs = Object.values(JSON.parse(cvt))
      prs.pop();
      io.sockets.emit('init', { cells: prs })
    }
  })
  
  socket.on('disconnect', () => {
    console.log("TCL: 'disconnect'", 'disconnect')
  })
  socket.on('flip box', ({ x, y, color }) => {
    cells[x][y] = { col: color }
    io.sockets.emit('flip box', { x, y, value: cells[x][y] })
    const state = new State()
    state.state = cells
    state.time = new Date().getTime()
    state.save()
  }) 

  socket.on('undo', steps => {
    State.find().sort('-time').limit(steps).remove().exec();
    State.find().sort('-time').limit(1).exec((err, state) => {
      cells = state
      io.sockets.emit('undo', state)
    })
  })

})

server.listen(port, () => {
  console.log("TCL: port", port)
})