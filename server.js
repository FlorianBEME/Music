require("dotenv").config();
const PORT = process.env.PORT;

const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Websocket
io.on("connection", (socket) => {
  console.log("SOCKET: conection: " + socket.id);

  socket.on("update", (args, data) => {
    console.log("SOCKET: ", "args: " + args);
    switch (args) {
      case "musiclist":
        console.log("SOCKET: MAJ music");
        socket.broadcast.emit("musicupdate", true);
        break;
      case "title":
        console.log("SOCKET: MAJ titre music");
        socket.broadcast.emit("titleupdate", true);
        break;
      case "user":
        console.log("SOCKET: MAJ visiteur");
        socket.broadcast.emit("userupdate", true);
        break;
      case "visitorallowed":
        console.log("SOCKET: MAJ visiteur permission");
        socket.broadcast.emit("visitorallowed", true);
        break;
      case "event":
        console.log("SOCKET: MAJ event");
        socket.broadcast.emit("event", true);
        break;
      case "settitle":
        console.log("SOCKET: MAJ Title");
        socket.broadcast.emit("settitle", true);
        break;
      case "pop":
        console.log("SOCKET: MAJ Popup");
        socket.broadcast.emit("pop", true);
        break;
      case "footer":
        console.log("SOCKET: MAJ Footer");
        socket.broadcast.emit("footer", true);
        break;
      case "userupdate":
        console.log("SOCKET: MAJ user");
        socket.broadcast.emit("userupdate", true);
        break;
      case "setbanner":
        console.log("SOCKET: MAJ banner");
        socket.broadcast.emit("setbanner", true);
        break;
      default:
        break;
    }
  });

  socket.on("disconnect", () => {
    console.log("SOCKET: deconection: " + socket.id);
  });
});

server.listen(PORT, (err) => {
  if (err) {
    console.error(`Error : ${err.message}`);
  } else {
    console.log("Server started on " + PORT);
  }
});
