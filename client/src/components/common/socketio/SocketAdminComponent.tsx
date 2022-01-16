import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "./socket";

import { addNewSong } from "../../../slicer/musicSlice";

const SocketAdminComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const adminSocket = () => {
      if (!socket) return true;

      socket.on("update-list-visitor", (data: any) => {
        if (data) {
          console.log("MUSIC: Ajout d'une music");
          dispatch(addNewSong(data));
        }
      });
    };

    adminSocket();
    return () => {};
  }, [dispatch]);

  return null;
};

const disconnect = () => {
  socket.disconnect();
};

export { SocketAdminComponent, disconnect };
