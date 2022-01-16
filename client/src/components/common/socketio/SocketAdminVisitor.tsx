import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNewVisitor, updateVisitor } from "../../../slicer/usersSlice";
import { socket } from "./socket";

const SocketAdminVisitor = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const adminSocket = () => {
      if (!socket) return true;

      socket.on("update-list-visitor", (data: any) => {
        if (data) {
          console.log("VISITOR: Ajout d'un visiteur");
          dispatch(addNewVisitor(data));
        }
      });

      socket.on("modify-visitor", (data: any) => {
        if (data) {
          console.log("VISITOR: Ajout d'un visiteur");
          dispatch(updateVisitor(data));
        }
      });
    };

    adminSocket();
    return () => {};
  }, [dispatch]);

  return null;
};

export { SocketAdminVisitor };
