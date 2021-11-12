/*
    TODO:
        - Stash username as session variable??
            - Upon login?
            - Then store it in a variable upon connection
        - Emit "join room" and whatnot on button press for room id not on page load
        - Then send to imani's page for the actual room functionality.
        - Figure out the socket server for heroku (docker compose)
*/
var app  = require("express")();
var http = require("http").createServer(app);
var io   = require("socket.io")(http);


app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});


io.on("connection", function (socket) {
  console.log("connected");

  socket.on("join room", (data) => {
    console.log('in room');    
  });

  

  socket.on("disconnect", () => {
    console.log("disconnected");
  });

});

http.listen(3000, function () {
    console.log("on port 3000");
});