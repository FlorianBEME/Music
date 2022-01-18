import { useSelector } from "react-redux";

import { eventStore } from "../../../slicer/eventSlice";
import { picturesAll } from "../../../slicer/photoSlice";
import { SocketAdminPicture } from "../../common/socketio/Admin/SocketAdminPicture";
import PictureCardAdmin from "../picture/PictureCardAdmin";
import TopPictureLayout from "../picture/TopPictureLayout";
// import Swal from "sweetalert2";

// import { FETCH } from "../../../FETCH";
// import { removeInput } from "../../common/removeInput";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import withReactContent from "sweetalert2-react-content";

// const MySwal = withReactContent(Swal);

const PictureLayout = () => {
  const token = localStorage.getItem("token");
  const event = useSelector(eventStore);
  const pictureAvailable = useSelector(picturesAll);

  return (
    <div>
      <SocketAdminPicture />
      <div className="hidden  sm:flex flex-col ">
        {event ? (
          !event.isLoad ? (
            <div className="w-full flex justify-center items-center">
              <p className="dark:text-gray-100 py-52">
                Pas d'évenement en cours
              </p>
            </div>
          ) : event.active_wall_picture ? (
            <div>
              <TopPictureLayout token={token} />
              <div className="py-4">
                {pictureAvailable.map((el: any, index: number) => {
                  return (
                    <div key={index}>
                      {/* ICI */}
                      {/* <PictureCardAdmin
                        isAccept={el.isAccept}
                        change={() => {}}
                        src={el.source}
                        id={el.id}
                      /> */}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center">
              <p className="dark:text-gray-100 py-52">
                Fonctionnalitée désactivée
              </p>
            </div>
          )
        ) : null}
      </div>
      <div className="sm:hidden flex justify-center  items-center">
        <p className="text-gray-700 dark:text-white text-center">
          Fonctionnalité actuellement indisponible pour ce format d'écran
        </p>
      </div>
    </div>
  );
};

export default PictureLayout;
