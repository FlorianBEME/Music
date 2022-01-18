import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateDefaultStatusPermissionPhoto } from "../../../../slicer/appSlice";

import { socket } from "../socket";

const SocketAdminPicture = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const adminSocket = () => {
      if (!socket) return true;

      socket.on("update-permission-visitor", (data: any) => {
        if (data) {
          console.log("ADMIN: Ajout d'un visiteur");
          dispatch(updateDefaultStatusPermissionPhoto(data.status));
        }
      });
    };

    adminSocket();
    return () => {};
  }, [dispatch]);

  return null;
};

export { SocketAdminPicture };
