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
  console.log("conected");

  socket.on("update", (args) => {
    console.log("je recoit ", args);
    if (args === "musiclist") {
      socket.broadcast.emit("musicupdate", true);
    } else if (args === "title") {
      socket.broadcast.emit("titleupdate", true);
    }
  });

  socket.on("disconnect", () => {
    console.log("deconection");
  });
});

server.listen(PORT, (err) => {
  if (err) {
    console.error(`Error : ${err.message}`);
  } else {
    console.log("Server started on " + PORT);
  }
});
