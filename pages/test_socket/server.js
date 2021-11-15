const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

io.on("connection", function(socket) {
  console.log("Socket connected");
  io.emit("user connected");
  socket.on("message", function(msg) {
    console.log("Recieved "+msg+" from client");
    io.emit("message", msg);
  });

  socket.on("test_onclick", function(msg) {
    console.log("Recieved "+msg+" from client's onclick event");
  });

 });

 http.listen(3000, () => console.log("listening on http://localhost:3000"));