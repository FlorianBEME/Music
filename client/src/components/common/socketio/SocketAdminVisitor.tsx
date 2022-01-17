import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addNewVisitor,
  updateCountVoteVisitor,
  updatePermissionVisitor,
  updateSubmitVisitor,
} from "../../../slicer/usersSlice";
import { socket } from "./socket";

const SocketAdminVisitor = () => {
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

      socket.on("increment-vote", (data: any) => {
        if (data) {
          console.log("ADMIN:  Increment vote user n° " + data.id);
          dispatch(updateCountVoteVisitor(data));
        }
      });

      socket.on("increment-submit-visitor", (data: any) => {
        if (data) {
          console.log(`ADMIN: Increment submit user n° ${data}`);
          dispatch(updateSubmitVisitor(data));
        }
      });
      socket.on("update-permission-visitor", (data: any) => {
        if (data) {
          console.log(
            `ADMIN: MAJ permission user n° ${data.id} | New permission: ${data.isNotAllowed}`
          );
          dispatch(
            updatePermissionVisitor({
              id: data.id,
              isNotAllowed: data.isNotAllowed,
            })
          );
        }
      });
    };

    adminSocket();
    return () => {};
  }, [dispatch]);

  return null;
};

export { SocketAdminVisitor };
