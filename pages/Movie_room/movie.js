$(function () {

    var chat = $('#input_chat');
    var chat_history = $('#chat_history');
    var booth = $('#voting_booth');

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if browser doesn't support WebSocket, just show
    // some notification and exit
    if (!window.WebSocket) {
    console.log('Browser does not support WebSocket.');
    return;
    }
    var connection = new WebSocket('ws://127.0.0.1:1337');
    
    connection.onopen = 
    function () {
        // Greet User
        booth.html(
            $('<p>',{text: 'Welcome !! Voting will begin when all users enter room.'}));
            //loop through chat history, and 
        chat_history.html(
            $('<p>', {text: 'Chatting.'}));
    };
  
    connection.onerror = function (error) {
      // an error occurred when sending/receiving data
    };
  
    connection.onmessage = function (message) {
      // try to decode json (I assume that each message
      // from server is json)
      try {
        var json = JSON.parse(message.data);
      } 
      catch (e) {
        console.log('This doesn\'t look like a valid JSON: ',
            message.data);
        return;
      }
      // handle incoming message
      if (json.type === 'movie'){
          var movie_name = json.data[0];
        booth.html(
            $('<p>',{text: movie_name}));
      }
    };
});