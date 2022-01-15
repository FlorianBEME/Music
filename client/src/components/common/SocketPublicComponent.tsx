import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import io from "socket.io-client";
import {
  updateSong,
  addNewSong,
  initMusicStore,
} from "../../slicer/musicSlice";
import { updateEventInStore, deleteEvent } from "../../slicer/eventSlice";

import { ENDPOINT } from "../../FETCH";
import { updateAppTextBanner, updateAppTitleStyle,deleteAppTextBanner} from "../../slicer/appSlice";

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
          console.log("EVENT: Mise à jour Title banner");
          dispatch(updateAppTextBanner(data));
        }else{
          dispatch(deleteAppTextBanner());
        }
      });

      
    };
    publicSocket();
    return () => {};
  }, [dispatch]);

  return null;
};

const emitEvent = (eventemit: string, args: any, data?: undefined) => {
  console.log("Emit Event");
  socket.emit(eventemit, args, data);
};

const disconnect = () => {
  socket.disconnect();
};

export { SocketPublicComponent, emitEvent, disconnect };
