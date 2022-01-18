import { ReactElement, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import AllDeleteButton from "../../common/button/AllDeleteButton";
import CommonButton from "../../common/button/ComonButton";
import SwitchButton from "../../common/button/SwitchButton";

import axios from "axios";
import { FETCH } from "../../../FETCH";
import {
  appParam,
  updateDefaultStatusPermissionPhoto,
} from "../../../slicer/appSlice";
import { emitEvent } from "../../common/socketio/SocketPublicComponent";
import { picturesAll, removePicture } from "../../../slicer/photoSlice";

type TopPictureLayoutProp = {
  token: string | null;
};

export default function TopPictureLayout({
  token,
}: TopPictureLayoutProp): ReactElement {
  const dispatch = useDispatch();
  const app = useSelector(appParam);
  const picture = useSelector(picturesAll);

  const changeDefaultAllowPicture = () => {
    axios
      .put(
        `${FETCH}/app/app/defaultpictureaccept/0"`,
        { defaultPictureAccept: !app.app.defaultPictureAccept },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        dispatch(
          updateDefaultStatusPermissionPhoto(res.data.app.defaultPictureAccept)
        );
        emitEvent("ADMIN", "update-allowed-picture", {
          status: res.data.app.defaultPictureAccept,
        });
      })
      .catch(function (error) {
        if (error.response.status === 401) {
        } else {
          Swal.fire("Erreur!", "Une erreur est survenue", "error");
        }
      });
  };

  const allDelete = () => {
    Swal.fire({
      title: `Êtes-vous sûr de vouloir modifier le titre en cours ?`,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
          url: `${FETCH}/eventpicture/cleanpicture`,
          method: "DELETE",
        }).then((response) => {
          console.log(response);
          if (response.status === 200) {
            emitEvent("update", "remove-all-picture");
            dispatch(removePicture());
          }
        });
      }
    });
  };

  // const allDownload = () => {
  //   axios({
  //     url: `${FETCH}/eventpicture/download`,
  //     method: "GET",
  //     responseType: "blob",
  //   }).then((response) => {
  //     console.log(response);
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "Photos.zip");
  //     document.body.appendChild(link);
  //     link.click();
  //   });
  // };

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-3 items-center justify-center">
        <p className="text-gray-800 font-light dark:text-white">
          Statut par defaut:{" "}
          <span>
            {app.app.defaultPictureAccept ? "Accepter" : "En attente"}
          </span>
        </p>
        <SwitchButton
          checked={app.app.defaultPictureAccept}
          onchange={changeDefaultAllowPicture}
        />
      </div>
      {picture.length > 0 ? (
        <div className="flex space-x-4">
          <AllDeleteButton action={allDelete} />
          {/* <CommonButton action={allDownload} text="Tout télécharger" /> */}
        </div>
      ) : (
        <div>Aucunes Photos</div>
      )}
    </div>
  );
}
