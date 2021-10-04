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

io.on("connection", (socket) => {
  console.log("SOCKET: conection: " + socket.id);

  socket.on("update", (args) => {
    console.log("SOCKET: ajout", "args: " + args);
    if (args === "musiclist") {
      console.log("SOCKET: MAJ music");
      socket.broadcast.emit("musicupdate", true);
    } else if (args === "title") {
      console.log("SOCKET: MAJ titre music");
      socket.broadcast.emit("titleupdate", true);
    } else if (args === "user") {
      console.log("SOCKET: MAJ visiteur");
      socket.broadcast.emit("userupdate", true);
    } else if (args === "visitorallowed") {
      console.log("SOCKET: MAJ visiteur permission");
      socket.broadcast.emit("visitorallowed", true);
    } else if (args === "event") {
      console.log("SOCKET: MAJ event");
      socket.broadcast.emit("event", true);
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
