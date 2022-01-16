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
    console.log(args);
    switch (args) {
      case "musiclist":
        console.log("SOCKET: MAJ music");
        console.log(data);
        socket.broadcast.emit("musicupdate", data);
        break;
      case "event-delete":
        console.log("SOCKET: MAJ event-delete");
        console.log(data);
        socket.broadcast.emit("event-delete");
        break;
      case "event":
        console.log("SOCKET: MAJ event-update");
        console.log(data);
        socket.broadcast.emit("event-update", data);
        break;
      case "title-style":
        console.log("SOCKET: MAJ title-style");
        console.log(data);
        socket.broadcast.emit("title-style", data);
        break;
      case "banner":
        console.log("SOCKET: MAJ banner");
        console.log(data);
        socket.broadcast.emit("banner", data);
        break;
      case "footer-item-add":
        console.log("SOCKET: ADD footer-item");
        console.log(data);
        socket.broadcast.emit("footer-item-add", data);
        break;
      case "footer-item-delete":
        console.log("SOCKET: Delete footer-item");
        console.log(data);
        socket.broadcast.emit("footer-item-delete", data);
        break;
      case "footer-item-modify":
        console.log("SOCKET: MAJ footer-item");
        console.log(data);
        socket.broadcast.emit("footer-item-modify", data);
        break;
      case "footer-copyright-modify":
        console.log("SOCKET: MAJ footer-copyright");
        console.log(data);
        socket.broadcast.emit("footer-copyright-modify", data);
        break;
      case "user-add":
        console.log("SOCKET: MAJ user-add");
        console.log(data);
        socket.broadcast.emit("update-list-visitor", data);
        break;

      //////////////////////////////////////////////////////////////
      // case "title":
      //   console.log("SOCKET: MAJ titre music");
      //   socket.broadcast.emit("titleupdate", true);
      //   break;
      // case "user":
      //   console.log("SOCKET: MAJ visiteur");
      //   socket.broadcast.emit("userupdate", true); // Reception en admin
      //   break;
      // case "visitorallowed":
      //   console.log("SOCKET: MAJ visiteur permission");
      //   socket.broadcast.emit("visitorallowed", true);
      //   break;

      // case "settitle":
      //   console.log("SOCKET: MAJ Title");
      //   socket.broadcast.emit("settitle", true);
      //   break;
      // case "pop":
      //   console.log("SOCKET: MAJ Popup");
      //   socket.broadcast.emit("pop", true);
      //   break;
      // case "userupdate":
      //   console.log("SOCKET: MAJ user");
      //   socket.broadcast.emit("userupdate", true); // Reception en admin
      //   break;
      // case "setbanner":
      //   console.log("SOCKET: MAJ banner");
      //   socket.broadcast.emit("setbanner", true);
      //   break;
      // default:
      //   break;
    }
  });

  socket.on("eventpiture", (args) => {
    socket.broadcast.emit("addnewpicture", args);
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
