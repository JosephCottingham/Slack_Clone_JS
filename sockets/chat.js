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
    channels[data.channel].push({sender : data.sender, message : data.message});
    io.to(data.channel).emit('newMsg', data);
  })

  socket.on('getOnlineUsers', () => {
    //Send over the onlineUsers
    socket.emit('getOnlineUsers', onlineUsers);
  })

  socket.on('disconnect', function() {
    delete onlineUsers[socket.username];
    io.emit('userHasLeft', onlineUsers);
  });

  socket.on('newChannel', (newChannel) => {
    //Save the new channel to our channels object. The array will hold the messages.
    channels[newChannel] = [];
    //Have the socket join the new channel room.
    socket.join(newChannel);
    //Inform all clients of the new channel.
    io.emit('new channel', newChannel);
    //Emit to the client that made the new channel, to change their channel to the one they made.
    socket.emit('user changed channel', {
      channel : newChannel,
      messages : channels[newChannel]
    });
  })
}