   //var socket = io();
    var chat_history = document.getElementById('chat_history');
    var booth = document.getElementById('voting_booth');
    //var movie_img_url = 
    document.getElementById("movie_img").src ='https://upload.wikimedia.org/wikipedia/en/6/6a/Kingkong_bigfinal1.jpg';
    //var movie_name = 
    document.getElementById("movie_name").innerHTML = 'King Kong';
    //var movie_year = 
    document.getElementById("movie_year").innerHTML='2005';
    //var movie_genre = 
    document.getElementById("movie_genre").innerHTML = 'Action';
    var vote_message = document.getElementById("Vote_Message");
//Web socket stuff
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if browser doesn't support WebSocket, just show
    // some notification and exit
    /*if (!window.WebSocket) {
    console.log('Browser does not support WebSocket.');
    }*/
    var connection = new WebSocket('ws://127.0.0.1:1337');
    /*const socket = io("ws://127.0.0.1:3000");

    socket.on("connect", () =>{
      console.log("Connected");
      socket.send("Hello");
    })*/
    /*connection.onopen = 
    function () {

        // Greet User
        booth.innerHTML += '<p> Welcome !! Voting will begin when all users enter room.</p>';
            //loop through chat history, and 
        chat_history.innerHTML += '<p> Chatting </p>';
        vote_message.innerHTML = 'Vote here';
    };*/
  
   /* connection.onerror = function (error) {
      // an error occurred when sending/receiving data
    };*/

  
  /*connection.onmessage = function (message) {
      
      try {
        console.log("Message: "+ message);
        var json = JSON.parse(message.data, reviver);
      } 
      catch (e) {
        console.log('This doesn\'t look like a valid JSON: ',
            message.data);
        return;
      }
      // handle incoming message
      if (json.type === 'movie'){
          booth.innerHTML = '';
          console.log("Movies" + json.data);
          movie_name.innerHTML = json.data.get('movie_name');
          movie_genre.innerHTML = "Genre: " + json.data.get('genre');
          movie_year.innerHTML = "Year: " + json.data.get('year');
          movie_img_url.src = json.data.get('img_url');
      }
      if (json.type === 'chat_history'){
        for(chat in json.data){
          chat_history.innerHTML +=json.data[chat][0]+": "+json.data[chat][1] +'<br>';
          console.log("Chat history: "+json.data[chat]);
        }
      }
    }
*/
    function vote_yes(){
      /*connection.send(
        JSON.stringify({type:'vote',data:1},replacer)
      );*/
      vote_message.innerHTML = 'Vote of [YES] has been Recorded!!';
      console.log('Vote Sent');
    }

    function vote_no(){
      /*connection.send(
        JSON.stringify({type:'vote',data:0},replacer)
      );*/
      vote_message.innerHTML = 'Vote of [NO] has been Recorded!!';
      console.log('Vote Sent');
    }

 /*   function send_chat(){
      console.log('Sending Message');
    }

    function replacer(key, value) {
      if(value instanceof Map) {
        return {
          dataType: 'Map',
          value: Array.from(value.entries()), // or with spread: value: [...value]
        };
      } else {
        return value;
      }
    }
    function reviver(key, value) {
      if(typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
          return new Map(value.value);
        }
      }
      return value;
    }*/