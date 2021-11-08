    var chat = document.getElementById('input_chat');
    var chat_history = document.getElementById('chat_history');
    var booth = document.getElementById('voting_booth');
    var movie_img_url = document.getElementById("movie_img").src;
    var movie_name = document.getElementById("movie_name");
    var movie_year = document.getElementById("movie_year");
    var movie_genre = document.getElementById("movie_genre");


//Web socket stuff
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if browser doesn't support WebSocket, just show
    // some notification and exit
    if (!window.WebSocket) {
    console.log('Browser does not support WebSocket.');
    }
    var connection = new WebSocket('ws://127.0.0.1:1337');
    
    connection.onopen = 
    function () {
        // Greet User
        booth.innerHTML += '<p> Welcome !! Voting will begin when all users enter room.</p>';
            //loop through chat history, and 
        chat_history.innerHTML += '<p> Chatting </p>';
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
          console.log("Voting on movie "+json.data.get('movie_name'));
          movie_name.innerHTML = json.data.get('movie_name');
          movie_genre.innerHTML = json.data.get('genre');
          movie_year.innerHTML = json.data.get('year');
          movie_img_url.innerHTML = json.data.get('img_url');
          booth.innerHTML = movie_name +'<br>'+genre+'<br>'+year+'<br>'+img_url+'<br>';
      }
      if (json.type === 'chat_history'){
        for(chat in json.data){
          chat_history.innerHTML +=json.data[chat][0]+": "+json.data[chat][1] +'<br>';
          console.log(json.data[chat]);
        }
        
      }
    }

    function vote_yes(connection){
      console.log('Vote Recieved');
      connection.sendUTF(
        JSON.stringify({type:'vote',data:[current_movie,0]})
      );
    }

    function vote_no(){
      console.log('Vote Recieved');
      connection.sendUTF(
        JSON.stringify({type:'vote',data:[current_movie,1]})
      );
    }

    function send_chat(){
      console.log('Sending Message');
    }
