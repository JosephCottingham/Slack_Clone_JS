//index.js
var currentUser = null;
$(document).ready(()=>{
  const socket = io.connect();

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
  

})
