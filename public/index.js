//index.js
var currentUser = null;
$(document).ready(()=>{
  const socket = io.connect();
  socket.emit('getOnlineUsers');

  $('#create-user-btn').click((e)=>{
    e.preventDefault();
    if($('#username-input').val().length > 0){
      currentUser = $('#username-input').val();
      socket.emit('newUser', currentUser);
      $('.username-form').remove();
      // Have the main page visible
      $('.main-container').css('display', 'flex');
    }
  });

  $('#send-chat-btn').click((e)=>{
    e.preventDefault();
    msg = $('#chat-input').val();
    if(msg.length > 0){
      console.log('msg sent');
      socket.emit('newMsg', {user:currentUser,msg:msg});
      $('#chat-input').val("");
    }
  });

  $('#new-channel-btn').click( () => {
    let newChannel = $('#new-channel-input').val();
  
    if(newChannel.length > 0){
      // Emit the new channel to the server
      socket.emit('newChannel', newChannel);
      $('#new-channel-input').val("");
    }
  })
  

  //socket listeners
  socket.on('newUser', (username) => {
    console.log(`${username} has joined the chat`);
    // Add the new user to the online users div
    $('.users-online').append(`<div class="user-online">${username}</div>`);
  })
  socket.on('newMsg', (newMsg) => {
    console.log(newMsg);
    // Add the new user to the online users div
    $('.message-container').append(`
    <div class="message">
      <p class="message-user">${newMsg.user}: </p>
      <p class="message-text">${newMsg.msg}</p>
    </div>
  `);
  })
  socket.on('getOnlineUsers', (onlineUsers) => {
    //You may have not have seen this for loop before. It's syntax is for(key in obj)
    //Our usernames are keys in the object of onlineUsers.
    for(username in onlineUsers){
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
  })
  socket.on('userHasLeft', (onlineUsers) => {
    $('.users-online').empty();
    for(username in onlineUsers){
      $('.users-online').append(`<p>${username}</p>`);
    }
  });
  
  // Add the new channel to the channels list (Fires for all clients)
  socket.on('new channel', (newChannel) => {
    $('.channels').append(`<div class="channel">${newChannel}</div>`);
  });

  // Make the channel joined the current channel. Then load the messages.
  // This only fires for the client who made the channel.
  socket.on('user changed channel', (data) => {
    $('.channel-current').addClass('channel');
    $('.channel-current').removeClass('channel-current');
    $(`.channel:contains('${data.channel}')`).addClass('channel-current');
    $('.channel-current').removeClass('channel');
    $('.message').remove();
    data.messages.forEach((message) => {
      $('.message-container').append(`
        <div class="message">
          <p class="message-user">${message.sender}: </p>
          <p class="message-text">${message.message}</p>
        </div>
      `);
    });
  })
  

})
