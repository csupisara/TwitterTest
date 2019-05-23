const server = require('express')()
const Twitter = require('twitter')
const socketIO = require('socket.io')
const firebase = require("firebase")

var firebaseConfig = {
  apiKey: "AIzaSyCeU4jshffXwvq-jpTmjMD5LHl8a-jh--E",
  authDomain: "swptwitter.firebaseapp.com",
  databaseURL: "https://swptwitter.firebaseio.com",
  projectId: "swptwitter",
  storageBucket: "swptwitter.appspot.com",
  messagingSenderId: "348188449421",
  appId: "1:348188449421:web:0338f76cbe619bf7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const client = new Twitter({
  consumer_key: 'lBAZXS2VO4fjxOjhcROWCrbPK',
  consumer_secret: 'sY42rg9PBr5b7B5WsLm3zmqWkJoPjBDkMlNDUxsY21dFmmoxat',
  access_token_key: '3257696816-t5prsbQUEyZ6gPGW04xKuI4foR0iycMLt4xl5RM',
  access_token_secret: 'DvywBy0eZnmVeyt2B4NmoBe9cwlgEFnOhfQJAAWIHuBUs'
})

const port = process.env.PORT || '4000'

server.get('/', (req, res) => {
  res.send("Hello")
})

const app = server.listen(port, () => {
  console.log('Server is listening at ' + port)
})

const io = socketIO.listen(app)
// รอการ connect จาก client
io.on('connection', client => {
  console.log('user connected')

  // เมื่อ Client ตัดการเชื่อมต่อ
  client.on('disconnect', () => {
    console.log('user disconnected')
  })
})

const stream = client.stream('statuses/filter', { track: 'tradewar' })
stream.on('data', function (event) {
  if (event) {
    const value = { text: event.text, timestamp: event.timestamp_ms }
    console.log(value)
    firebase.database().ref("/db").push(value)
    io.sockets.emit('new-message', value)
  }
})