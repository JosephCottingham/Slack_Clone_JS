// chat.js
module.exports = (io, socket) => {

    // Listen for "new user" socket emits
    socket.on('newUser', (username) => {
      console.log(`${username} has joined the chat!`);
      io.emit("newUser", username);
    })
  }