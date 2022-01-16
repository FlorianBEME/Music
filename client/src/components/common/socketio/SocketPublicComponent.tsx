import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "./socket";

import { addNewSong, initMusicStore } from "../../../slicer/musicSlice";
import { updateEventInStore, deleteEvent } from "../../../slicer/eventSlice";
import {
  updateAppTextBanner,
  updateAppTitleStyle,
  deleteAppTextBanner,
  addNewItemFooterInStore,
  deleteItemFooterInStore,
  updateItemFooter,
  updateCopyrightTextInStore,
} from "../../../slicer/appSlice";

const SocketPublicComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const publicSocket = () => {
      if (!socket) return true;

      socket.on("musicupdate", (data: any) => {
        if (data) {
          console.log("MUSIC: Ajout d'une music");
          dispatch(addNewSong(data));
        }
      });

      socket.on("event-update", (data: any) => {
        if (data) {
          console.log("EVENT: Mise à jour Event");
          dispatch(updateEventInStore(data));
        }
      });

      socket.on("event-delete", (data: any) => {
        console.log("EVENT: Suppression de l'event");
        dispatch(deleteEvent());
        dispatch(initMusicStore([]));
      });

      socket.on("title-style", (data: any) => {
        if (data) {
          console.log("EVENT: Mise à jour Title style");
          dispatch(updateAppTitleStyle(data));
        }
      });

      socket.on("banner", (data: any) => {
        if (data) {
          console.log("EVENT: Mise à jour texte banner");
          dispatch(updateAppTextBanner(data));
        } else {
          console.log("EVENT: Delete texte banner");
          dispatch(deleteAppTextBanner());
        }
      });

      socket.on("footer-item-add", (data: any) => {
        if (data) {
          console.log("EVENT: Ajout d'un item-footer");
          dispatch(addNewItemFooterInStore(data));
        }
      });
      socket.on("footer-item-delete", (id: any) => {
        if (id) {
          console.log("EVENT: Suppression d'un item footer");
          dispatch(deleteItemFooterInStore(id));
        }
      });
      socket.on("footer-item-modify", (data: any) => {
        if (data) {
          console.log("EVENT: MAJ d'un item footer");
          dispatch(updateItemFooter(data));
        }
      });
      socket.on("footer-copyright-modify", (data: any) => {
        if (data) {
          console.log("EVENT: MAJ du text copyright footer");
          dispatch(updateCopyrightTextInStore(data));
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
