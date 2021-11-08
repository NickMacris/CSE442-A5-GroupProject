//database init
    const { MongoClient } = require("mongodb");
    const { WSATYPE_NOT_FOUND } = require('constants');
    const imani_dbPass = process.env.DB_PASS_442;
    const imani_uri = 'mongodb+srv://CSE442:' + 'CSE442cse' + '@cluster0.k7tia.mongodb.net/test';
    const imani_client = new MongoClient(imani_uri,{keepAlive: 1});

//Global variables
    var skt_port = 1337;
    var clients = [];
    var voted = 0;
    var movie_list = [];
    var chat_history = [["User_1","Hello"],["User_2","Goodbye"]];
    var room_size = 1; // Get amount of people in room from db
    var current_movie = new Map();

//retrieve database info
    if(get_room_info()){
        console.log("Got room data");
    }

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

        //send chat history
        if(chat_history.length > 0){
            connection.sendUTF(
                JSON.stringify({type: 'chat_history', data: chat_history}));
        }

        //start voting once everyone joins
        if(client >= room_size){
            console.log("Begin Voting");
            vote(connection);
        }
        connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                var json = JSON.parse(message.data);
            } 
            catch (e) {
                console.log('This doesn\'t look like a valid JSON: ',
                    message.data);
            }
            if(json.type === 'vote'){
                console.log("Processing vote from User: ");
                
            }

            if(json.type === 'chat'){
                console.log("Processing chat from User: ");
            }
        }
        });

        connection.on('close', function(connection) {
        // close user connection
        });
    });

//helper funcitons
/**
 * Vote() should restart vote count, select movie to send to clients
 */
    function vote(connection){
        if(movie_list.length > 0){
            current_movie = movie_list[0].get('movie_data').get('movie_name');
            connection.sendUTF(
                JSON.stringify({type: 'movie', data: movie_list[0].get('movie_data')})
            );
            console.log("Sent: "+ movie_list[0].get('movie_data').get('movie_name'));
        }
    }
    function end_vote(connection){
        voted = 0;
        connection.sendUTF(
            JSON.stringify({type:'vote_result',data:[current_movie]})
        );
    }

//database interfaces
/**
 * Should retrieve room movie list and objects, and user list.
 * Completed
 */
async function get_room_info() {
        //Movie Data stored as
    /* movie_name: "moviename"
        genre:""
        yeae:""
        img_url:""
    */ 
    await imani_client.connect();
    console.log("MongoDB connected");
    const db = imani_client.db("Movies");
    const global_users = db.collection('MovieData');
    
    // Users are stored as [{username: "Username"},{password,"pass"}]
    global_users.findOne({movie_name:"King Kong"},{}, function(err, result) {
        if (err) throw err;
        var movie_map = new Map();
        var name = result['movie_name'];
        movie_map.set('movie_name', name);
        movie_map.set('genre', result['genre']);
        movie_map.set('year', result['year']);
        movie_map.set('img_url', result['img_url']);
        var movie_server = new Map();
        movie_server.set('movie_data',movie_map);
        movie_server.set('vote', 0);
        console.log(movie_server);
        movie_list.push(movie_server);
        return  (1);
    }); 
    return 0;
}
