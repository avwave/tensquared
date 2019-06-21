const express = require('express')
const http = require('http')
const socketIO = require('socket.io')


const port = '8010'

const app = express()

const server = http.createServer(app)

const io = socketIO(server)

const cells = new Array(10000).fill(false)

io.on('connection', socket => {
  io.sockets.emit('init', {cells})
  socket.on('disconnect', () => {
    
  })
  socket.on('flip box', ({ value, index }) => {
    console.log("TCL: value, index", value, index)
    cells[index] = !cells[index]
    io.sockets.emit('flip box', {value: cells[index], index})
  })
})

server.listen(port, () => {
  console.log("TCL: port", port)
})