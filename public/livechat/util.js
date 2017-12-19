var socket = io();

function handlePostBack(data) {
   // alert(data);
    socket.emit('chat message', data);
  //  $('#m').val('');
}

socket.on('chat message', function(msg){
    this.$chatHistory = $('.chat-history');
    this.$chatHistoryList =  this.$chatHistory.find('ul');
    this.$chatHistoryList.append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
});
