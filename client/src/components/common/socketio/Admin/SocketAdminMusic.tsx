import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addNewVisitor,
  updateCountVoteVisitor,
  updatePermissionVisitor,
  updateSubmitVisitor,
} from "../../../../slicer/usersSlice";
import { socket } from "../socket";

const SocketAdminMusic = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const adminSocket = () => {
      if (!socket) return true;

      socket.on("update-list-visitor", (data: any) => {
        if (data) {
          console.log("ADMIN: Ajout d'un visiteur");
          dispatch(addNewVisitor(data));
        }
      });
    };

    adminSocket();
    return () => {};
  }, [dispatch]);

  
  return null;
};

export { SocketAdminMusic };
