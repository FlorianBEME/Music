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
      default:
        break;
    }
  });

  socket.on("eventpiture", (args) => {
    socket.broadcast.emit("addnewpicture", args);
  });

  socket.on("ADMIN", (args, data) => {
    switch (args) {
      case "increment-vote":
        console.log(
          `SOCKET: Admin => Increment vote user n° ${data.id} | Nouveau Compte: ${data.countVote}`
        );
        socket.broadcast.emit("increment-vote", data);
        break;
      case "increment-submit-visitor":
        console.log(`SOCKET: Admin => Increment submit user n° ${data}`);
        socket.broadcast.emit("increment-submit-visitor", data);
        break;
      case "update-permission-visitor":
        console.log(
          `SOCKET: Admin => Update permission user n° ${data.id} | New Permission: ${data.isNotAllowed}`
        );
        socket.broadcast.emit("update-permission-visitor", data);
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
