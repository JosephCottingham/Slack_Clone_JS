//index.js
var currentUser = null;
$(document).ready(()=>{
  const socket = io.connect();
  socket.emit('getOnlineUsers');
  socket.emit('getChannels');
  socket.emit('userChangedChannel', "General");

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

  //Users can change the channel by clicking on its name.
  $(document).on('click', '.channel', (e)=>{
    console.log('userChangedChannel');
    let newChannel = e.target.textContent;
    socket.emit('userChangedChannel', newChannel);
  });

  $('#send-chat-btn').click((e) => {
    e.preventDefault();
    // Get the client's channel
    let channel = $('.channel-current').text();
    let message = $('#chat-input').val();
    if(message.length > 0){
      socket.emit('newMsg', {
        sender : currentUser,
        message : message,
        //Send the channel over to the server
        channel : channel
      });
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
  socket.on('newMsg', (data) => {
    //Only append the message if the user is currently in that channel
    let currentChannel = $('.channel-current').text();
    if(currentChannel == data.channel){
      $('.message-container').append(`
        <div class="message">
          <p class="message-user">${data.sender}: </p>
          <p class="message-text">${data.message}</p>
        </div>
      `);
    }
  })
  socket.on('getOnlineUsers', (onlineUsers) => {
    //You may have not have seen this for loop before. It's syntax is for(key in obj)
    //Our usernames are keys in the object of onlineUsers.
    for(username in onlineUsers){
      $('.users-online').append(`<div class="user-online">${username}</div>`);
    }
  })
  socket.on('getChannels', (channels) => {
    //You may have not have seen this for loop before. It's syntax is for(key in obj)
    //Our usernames are keys in the object of onlineUsers.
    console.log(channels);
    for(channel in channels){
      $('.channels').append(`<div class="channel">${channel}</div>`);
    }
  })
  socket.on('userHasLeft', (onlineUsers) => {
    $('.users-online').empty();
    for(username in onlineUsers){
      $('.users-online').append(`<p>${username}</p>`);
    }
  });
  
  // Add the new channel to the channels list (Fires for all clients)
  socket.on('newChannel', (newChannel) => {
    $('.channels').append(`<div class="channel">${newChannel}</div>`);
  });

  // Make the channel joined the current channel. Then load the messages.
  // This only fires for the client who made the channel.
  socket.on('userChangedChannel', (data) => {
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
