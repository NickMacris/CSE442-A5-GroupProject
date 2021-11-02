var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});

//Global variables
var skt_port = 1337;
var clients = [];
var movie_list = [["King Kong",0],["Godzilla",0],["Chicken Run",0],["Ratatowey",0]];
var chat_history = [];
var room_size = 3; // Get amount of people in room from db

server.listen(skt_port, function() { 
    console.log((new Date()) + ", Server is now listening on port: " + skt_port);
});

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ", Connection from origin: " + request.origin +".");
    var connection = request.accept(null, request.origin);
    var client = clients.push(connection) -1;
    
    if(movie_list.length >0){
        connection.sendUTF(
            JSON.stringify({type: 'movie', data: movie_list[0]}));
    }

    if(chat_history.length > 0){
        connection.sendUTF(
            JSON.stringify({type: 'chat_history', data: chat_history}));
    }

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
    if (message.type === 'utf8') {
        // process WebSocket message
    }
    });

    connection.on('close', function(connection) {
    // close user connection
    });
});