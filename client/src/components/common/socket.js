import { ENDPOINT } from "../../FETCH";
import io from "socket.io-client";

const socket = io(ENDPOINT);

const initiateSocket = (args) => {
  console.log(`Connecting socket...`);
};

const subscribeToSocket = (data) => {
  if (!socket) return true;

  socket.on("musicupdate", () => {
    console.log("musicupdate: jai bien recu et je met a jour");
    return data("musicupdate");
  });
  socket.on("title", () => {
    console.log("title: jai bien recu et je met a jour");
    return data("musicupdate");
  });
  socket.on("titleupdate", (args) => {
    console.log("titleupdate: jai bien recu et je met a jour");
    return data("title");
  });
  socket.on("visitorallowed", (args) => {
    console.log("visitorallowed: jai bien recu et je met a jour");
    return data("visitorallowed");
  });
  socket.on("userupdate", (args) => {
    console.log("userupdate: jai bien recu et je met a jour");
    return data("userupdate");
  });
  socket.on("event", (args) => {
    console.log("userupdate: jai bien recu et je met a jour");
    return data("event");
  });
  socket.on("pop", (args) => {
    console.log(data);
    console.log("userupdate: jai bien recu et je met a jour");
    return data("pop" + data);
  });
};

const emitEvent = (eventemit, args) => {
  socket.emit(eventemit, args);
};

const disconnect = () => {
  socket.disconnect();
};

export { emitEvent, initiateSocket, subscribeToSocket, disconnect };
