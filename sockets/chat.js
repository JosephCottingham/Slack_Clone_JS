// chat.js
module.exports = (io, socket, onlineUsers) => {

    // Listen for "new user" socket emits
    socket.on('newUser', (username) => {
      //Save the username as key to access the user's socket id
      onlineUsers[username] = socket.id;
      //Save the username to socket as well. This is important for later.
      socket["username"] = username;
      console.log(`${username} has joined the chat!`);
      io.emit("newUser", username);
    })

    //Listen for new messages
  socket.on('newMsg', (data) => {
    // Send that data back to ALL clients
    console.log(`${data.user}: ${data.msg}`)
    io.emit('newMsg', data);
  })

  socket.on('getOnlineUsers', () => {
    //Send over the onlineUsers
    socket.emit('getOnlineUsers', onlineUsers);
  })

  socket.on('disconnect', function() {
    delete onlineUsers[socket.username];
    io.emit('userHasLeft', onlineUsers);
  });
}