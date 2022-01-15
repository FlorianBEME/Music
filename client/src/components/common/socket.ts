import { ENDPOINT } from "../../FETCH";
import io from "socket.io-client";

import { useDispatch } from "react-redux";
import { updateSong } from "../../slicer/musicSlice";
import store from "../../store";

// const socket = io(ENDPOINT);

const initiateSocket = () => {
  console.log(`Connecting socket...`);
};

const subscribeToSocket = (data: any, args?: any) => {
  // if (!socket) return true;
  // socket.on("musicupdate", () => {
  //   console.log("ici");
  //   console.log("musicupdate: j'ai bien recu et je met a jour");
  //   return data("musicupdate");
  // });
  // socket.on("title", () => {
  //   console.log("title: j'ai bien recu et je met a jour");
  //   return data("musicupdate");
  // });
  // socket.on("titleupdate", () => {
  //   console.log("titleupdate: j'ai bien recu et je met a jour");
  //   return data("title");
  // });
  // socket.on("visitorallowed", () => {
  //   console.log("visitorallowed: j'ai bien recu et je met a jour");
  //   return data("visitorallowed");
  // });
  // socket.on("userupdate", () => {
  //   console.log("userupdate: j'ai bien recu et je met a jour");
  //   return data("userupdate");
  // });
  // socket.on("event", () => {
  //   console.log("event: j'ai bien recu et je met a jour");
  //   return data("event");
  // });
  // // couleur et position du titre evenement
  // socket.on("settitle", () => {
  //   console.log("TitleEvent: j'ai bien recu et je met a jour");
  //   return data("settitle");
  // });
  // // Pop Up
  // socket.on("pop", () => {
  //   console.log("Pop: j'ai bien recu et je met a jour");
  //   return data("pop");
  // });
  // // footer
  // socket.on("footer", () => {
  //   console.log("Footer: j'ai bien recu et je met a jour");
  //   return data("footer");
  // });
  // //Banner
  // socket.on("setbanner", () => {
  //   console.log("Banner: j'ai bien recu et je met a jour");
  //   return data("setbanner");
  // });
  // //eventpicture
  // socket.on("addnewpicture", (args) => {
  //   console.log(args);
  //   return data({ data: "addnewpicture", args: args });
  // });
};
// const publicSocket = () => {
//   if (!socket) return true;
//   console.log("subTest");
//   socket.on("musicupdate", (data) => {
//     console.log(data);
//     if (data) {
//     }
//   });
// };


const disconnect = () => {
  // socket.disconnect();
};

export { initiateSocket, subscribeToSocket, disconnect };
