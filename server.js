const express = require('express')
const socketIO = require('socket.io')

const port = process.env.PORT|| 8081
const app = express()

const server = require('http').Server(app)

const io = module.exports.io = socketIO(server)
app.use(express.static(__dirname + '/build'))
const cells = Array(100).fill().map(() => Array(100).fill({col:'green'}))


io.on('connection', socket => {
  io.sockets.emit('init', {cells})
  socket.on('disconnect', () => {
    
  })
  socket.on('flip box', ({ x, y, color }) => {
    cells[x][y] = { col: color }
    io.sockets.emit('flip box', {x, y, value: cells[x][y]})
  })
})

server.listen(port, () => {
  console.log("TCL: port", port)
})