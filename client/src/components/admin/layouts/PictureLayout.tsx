import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import TopPictureLayout from "../picture/TopPictureLayout";
import Swal from "sweetalert2";

import { FETCH } from "../../../FETCH";
import { removeInput } from "../../common/removeInput";
// import { emitEvent, subscribeToSocket } from "../../common/socket";

const MySwal = withReactContent(Swal);

type MusicLayoutProps = {
  event: any;
};

const PictureLayout = ({ event }: MusicLayoutProps) => {
  const token = localStorage.getItem("token");

  return (
    <div>
      <div className="hidden  sm:flex flex-col ">
        {event ? (
          !event.isLoad? (
            <div className="w-full flex justify-center items-center">
              <p className="dark:text-gray-100 py-52">
                Pas d'évenement en cours
              </p>
            </div>
          ) : event.active_wall_picture ? (
            <div>
              <TopPictureLayout token={token} />
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
