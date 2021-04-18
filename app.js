//App.js
const express = require('express');
const app = express();
//Socket.io has to use the http server
const server = require('http').Server(app);

//Socket.io
const io = require('socket.io')(server);

//Save the users in this object
let onlineUsers = {};
//Save the channels in this object.
let channels = {"General" : []}

io.on("connection", (socket) => {
    require('./sockets/chat.js')(io, socket, onlineUsers, channels);
    console.log("New user connected!");
})

//Express View Engine for Handlebars
const exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'))

app.get('/', (req, res) => {
  res.render('index.handlebars');
})


server.listen('3000', () => {
  console.log('Server listening on Port 3000');
})