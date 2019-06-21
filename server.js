const express = require('express')
const http = require('http')
const socketIO = require('socket.io')


const port = '8010'

const app = express()

const server = http.createServer(app)

const io = socketIO(server)

io.on('connection', socket => {
  console.log("TCL: 'user connected'", 'user connected')
  socket.on('disconnect', () => {
    console.log("TCL: 'disconnected'", 'disconnected')
  })
})

server.listen(port, () => {
  console.log("TCL: port", port)
})