import { useEffect } from "react";
import { useDispatch } from "react-redux";

import io from "socket.io-client";

import { ENDPOINT } from "../../FETCH";
import { addNewSong } from "../../slicer/musicSlice";
import { updateEventInStore, deleteEvent } from "../../slicer/eventSlice";
import {
  updateAppTextBanner,
  updateAppTitleStyle,
  deleteAppTextBanner,
  addNewItemFooterInStore,
  deleteItemFooterInStore,
  updateItemFooter,
  updateCopyrightTextInStore,
} from "../../slicer/appSlice";

const socket = io(ENDPOINT);

const SocketPublicComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const publicSocket = () => {
      if (!socket) return true;

      socket.on("musicupdate", (data) => {
        if (data) {
          console.log("MUSIC: Ajout d'une music");
          dispatch(addNewSong(data));
        }
      });

      socket.on("event-update", (data) => {
        if (data) {
          console.log("EVENT: Mise à jour Event");
          dispatch(updateEventInStore(data));
        }
      });

      socket.on("event-delete", (data) => {
        console.log("EVENT: Suppression de l'event");
        dispatch(deleteEvent());
      });

      socket.on("title-style", (data) => {
        if (data) {
          console.log("EVENT: Mise à jour Title style");
          dispatch(updateAppTitleStyle(data));
        }
      });

      socket.on("banner", (data) => {
        if (data) {
          console.log("EVENT: Mise à jour texte banner");
          dispatch(updateAppTextBanner(data));
        } else {
          console.log("EVENT: Delete texte banner");
          dispatch(deleteAppTextBanner());
        }
      });

      socket.on("footer-item-add", (data) => {
        if (data) {
          console.log("EVENT: Ajout d'un item-footer");
          dispatch(addNewItemFooterInStore(data));
        }
      });
      socket.on("footer-item-delete", (id) => {
        if (id) {
          console.log("EVENT: Suppression d'un item footer");
          dispatch(deleteItemFooterInStore(id));
        }
      });
      socket.on("footer-item-modify", (data) => {
        if (data) {
          console.log("EVENT: MAJ d'un item footer");
          dispatch(updateItemFooter(data));
        }
      });
      socket.on("footer-copyright-modify", (data) => {
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
