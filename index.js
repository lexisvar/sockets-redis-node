var app = require('express')()
var server = require('http').Server(app)
var redis = require('redis')
var ip = require('ip')
require('dotenv').config()

const public_ip = ip.address()
const port = process.env.PORT || 3000

server.listen(port,() => {
	console.log(`Servidor  en http://localhost:${port}`)
  console.log(`Servidor  en http://${public_ip}:${port}`)
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});
 
var io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
})

io.on('connection', (socket) => {    
  console.log("client connected")
  var redisClient = redis.createClient()
  redisClient.psubscribe('*')
  redisClient.on("pmessage", (subscribe, channel, data) => {
    socket.emit(channel, data)
  })

  socket.on('disconnect', () => {
    redisClient.quit()
    console.log("client disconnected")
  })
})
