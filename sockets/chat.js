// chat.js
module.exports = (io, socket) => {

    // Listen for "new user" socket emits
    socket.on('newUser', (username) => {
      console.log(`${username} has joined the chat!`);
      io.emit("newUser", username);
    })

    //Listen for new messages
  socket.on('newMsg', (data) => {
    // Send that data back to ALL clients
    console.log(`${data.user}: ${data.msg}`)
    io.emit('newMsg', data);
  })
}