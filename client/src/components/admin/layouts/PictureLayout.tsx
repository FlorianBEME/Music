import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FETCH } from "../../../FETCH";

import { removeInput } from "../../common/removeInput";
import { emitEvent, subscribeToSocket } from "../../common/socket";
import Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

type MusicLayoutProps = {
  event: [] | any;
};

const PictureLayout = ({ event }: MusicLayoutProps) => {
  const token = localStorage.getItem("token");

  return (
    <div>
      <div className="hidden  sm:flex flex-col ">
        {event ? (
          event.length <= 0 ? (
            <div className="w-full flex justify-center items-center">
              <p className="dark:text-gray-100 py-52">
                Pas d'évenement en cours
              </p>
            </div>
          ) : event[0].active_wall_picture ? (
            <div></div>
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
