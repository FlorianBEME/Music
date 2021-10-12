import { ENDPOINT } from "../../FETCH";
import io from "socket.io-client";

const socket = io(ENDPOINT);

const initiateSocket = (args) => {
  console.log(`Connecting socket...`);
};

const subscribeToSocket = (data) => {
  if (!socket) return true;

  socket.on("musicupdate", () => {
    console.log("musicupdate: j'ai bien recu et je met a jour");
    return data("musicupdate");
  });
  socket.on("title", () => {
    console.log("title: j'ai bien recu et je met a jour");
    return data("musicupdate");
  });
  socket.on("titleupdate", (args) => {
    console.log("titleupdate: j'ai bien recu et je met a jour");
    return data("title");
  });
  socket.on("visitorallowed", (args) => {
    console.log("visitorallowed: j'ai bien recu et je met a jour");
    return data("visitorallowed");
  });
  socket.on("userupdate", (args) => {
    console.log("userupdate: j'ai bien recu et je met a jour");
    return data("userupdate");
  });
  socket.on("event", (args) => {
    console.log("event: j'ai bien recu et je met a jour");
    return data("event");
  });
  // couleur et position du titre evenement
  socket.on("settitle", (args) => {
    console.log("TitleEvent: j'ai bien recu et je met a jour");
    return data("settitle");
  });
  // Pop Up
  socket.on("pop", (args) => {
    console.log("Pop: j'ai bien recu et je met a jour");
    return data("pop");
  });
};

const emitEvent = (eventemit, args) => {
  socket.emit(eventemit, args);
};

const disconnect = () => {
  socket.disconnect();
};

export { emitEvent, initiateSocket, subscribeToSocket, disconnect };
