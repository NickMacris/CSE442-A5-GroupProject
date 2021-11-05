//database init
    const { MongoClient } = require("mongodb");
    const { WSATYPE_NOT_FOUND } = require('constants');
    const imani_dbPass = process.env.DB_PASS_442;
    const imani_uri = 'mongodb+srv://CSE442:' + 'CSE442cse' + '@cluster0.k7tia.mongodb.net/test';
    const imani_client = new MongoClient(imani_uri,{keepAlive: 1});

//Global variables
    var skt_port = 1337;
    var clients = [];
    var movie_list = [["King Kong",0],["Godzilla",0],["Chicken Run",0],["Ratatowey",0]];
    var chat_history = [["User_1","Hello"],["User_2","Goodbye"]];
    var room_size = 3; // Get amount of people in room from db

//websocket init
    var WebSocketServer = require('websocket').server;
    var http = require('http');
    var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
    });
    server.listen(skt_port, function() { 
        console.log((new Date()) + ", Server is now listening on port: " + skt_port);
    });
    wsServer = new WebSocketServer({
    httpServer: server
    });

// Server functionality
    wsServer.on('request', function(request) {
        console.log((new Date()) + ", Connection from origin: " + request.origin +".");
        var connection = request.accept(null, request.origin);
        var client = clients.push(connection) -1;
        console.log('User #' + client+' has been added');

        if(chat_history.length > 0){
            connection.sendUTF(
                JSON.stringify({type: 'chat_history', data: chat_history}));
        }

        if(client >= room_size){
            console.log("Begin Voting");
            vote();
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

//helper funcitons
/**
 * Vote() should send voting related client messages
 */
    function vote(){
        connection.sendUTF(
            JSON.stringify({type:'vote',data:'Begin'})
        )
        
        if(movie_list.length >0){
            connection.sendUTF(
                JSON.stringify({type: 'movie', data: movie_list[0]}));
        }
    }

//database interfaces
/**
 * Should retrieve room movie list and objects, and user list.
 * Not completed!!
 */
    async function get_room_info(name,res) {
        await imani_client.connect();
        console.log("MongoDB connected");
        console.log(name);
        const db = imani_client.db("UserInfo");
        const global_users = db.collection('username');//Global Users
        // Users are stored as [{username: "Username"},{password,"pass"}]
        global_users.findOne({username:name},{}, function(err, result) {
            if (err) throw err;
            console.log(result);
        }); 
    }
