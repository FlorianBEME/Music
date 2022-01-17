import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "./socket";

import {
  addNewSong,
  incrementVote,
  initMusicStore,
  removeAllMusic,
  removeMusic,
  updateStatusMusic,
} from "../../../slicer/musicSlice";
import { updateEventInStore, deleteEvent } from "../../../slicer/eventSlice";
import {
  updateAppTextBanner,
  updateAppTitleStyle,
  deleteAppTextBanner,
  addNewItemFooterInStore,
  deleteItemFooterInStore,
  updateItemFooter,
  updateCopyrightTextInStore,
  udpdateSongInCurrent,
} from "../../../slicer/appSlice";

const SocketPublicComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const publicSocket = () => {
      if (!socket) return true;

      socket.on("musicupdate", (data: any) => {
        if (data) {
          console.log("PUBLIC-MUSIC: Ajout d'une music");
          dispatch(addNewSong(data));
        }
      });

      socket.on("event-update", (data: any) => {
        if (data) {
          console.log("PUBLIC-EVENT: Mise à jour Event");
          dispatch(updateEventInStore(data));
        }
      });

      socket.on("PUBLIC-event-delete", (data: any) => {
        console.log("EVENT: Suppression de l'event");
        dispatch(deleteEvent());
        dispatch(initMusicStore([]));
      });

      socket.on("title-style", (data: any) => {
        if (data) {
          console.log("PUBLIC-EVENT: Mise à jour Title style");
          dispatch(updateAppTitleStyle(data));
        }
      });

      socket.on("banner", (data: any) => {
        if (data) {
          console.log("PUBLIC-EVENT: Mise à jour texte banner");
          dispatch(updateAppTextBanner(data));
        } else {
          console.log("PUBLIC-EVENT: Delete texte banner");
          dispatch(deleteAppTextBanner());
        }
      });

      socket.on("footer-item-add", (data: any) => {
        if (data) {
          console.log("PUBLIC-EVENT: Ajout d'un item-footer");
          dispatch(addNewItemFooterInStore(data));
        }
      });
      socket.on("footer-item-delete", (id: any) => {
        if (id) {
          console.log("PUBLIC-EVENT: Suppression d'un item footer");
          dispatch(deleteItemFooterInStore(id));
        }
      });
      socket.on("footer-item-modify", (data: any) => {
        if (data) {
          console.log("PUBLIC-EVENT: MAJ d'un item footer");
          dispatch(updateItemFooter(data));
        }
      });
      socket.on("footer-copyright-modify", (data: any) => {
        if (data) {
          console.log("PUBLIC-EVENT: MAJ du text copyright footer");
          dispatch(updateCopyrightTextInStore(data));
        }
      });
      socket.on("music-count-vote", (data: any) => {
        if (data) {
          console.log(data);
          console.log(
            `PUBLIC-MUSIC: MAJ count vote music n°${data.id} | new Count: ${data.countVote}`
          );
          dispatch(incrementVote(data));
        }
      });
      socket.on("music-remove", (data: any) => {
        if (data) {
          console.log(data);
          console.log(
            `PUBLIC-MUSIC: MAJ count vote music n°${data.id} | new Count: ${data.countVote}`
          );
          dispatch(removeMusic(data));
        }
      });
      socket.on("music-remove-all", () => {
        console.log(`PUBLIC-MUSIC: Remove music all`);
        dispatch(removeAllMusic());
      });
      socket.on("music-status", (data: any) => {
        console.log(`PUBLIC-MUSIC: update status music`);
        if (data) {
          console.log(data);
          dispatch(updateStatusMusic(data));
        }
      });
      socket.on("song-in-current", (data: any) => {
        console.log(
          `PUBLIC-MUSIC: update musique en cours | Artiste:${data.artist} Titre:${data.title}`
        );
        if (data) {
          console.log(data);
          dispatch(udpdateSongInCurrent(data));
        }
      });
    };
    publicSocket();
    return () => {};
  }, [dispatch]);

  return null;
};

const emitEvent = (eventemit: string, args: any, data?: any) => {
  console.log("Emit Event");
  socket.emit(eventemit, args, data);
};

const disconnect = () => {
  socket.disconnect();
};

export { SocketPublicComponent, emitEvent, disconnect };
