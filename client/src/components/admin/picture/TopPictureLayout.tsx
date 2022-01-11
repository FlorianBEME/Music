import React, { ReactElement, useState, useEffect } from "react";
import AllDeleteButton from "../../common/button/AllDeleteButton";
import CommonButton from "../../common/button/ComonButton";
import SwitchButton from "../../common/button/SwitchButton";

import axios from "axios";
import { FETCH } from "../../../FETCH";

export default function TopPictureLayout(): ReactElement {
  const [defaultAllowPicture, setDefaultAllowPicture] = useState(false);

  useEffect(() => {
    setDefaultAllowPicture(true);
    return () => {};
  }, []);

  const changeDefaultAllowPicture = () => {
    setDefaultAllowPicture(!defaultAllowPicture);
    // new Promise((resolve, reject) => {
    //     axios
    //       .put(
    //         `${FETCH}/app/titleEventappStyle/display/0"`,
    //         { display: !displayTitle },
    //         {
    //           headers: {
    //             "x-access-token": token,
    //           },
    //         }
    //       )
    //       .then((res) => {
    //         fetchDataEvent();
    //         emitEvent("update", "settitle");
    //         resolve(res);
    //       })
    //       .catch(function (error) {
    //         if (error.response.status === 401) {
    //           localStorage.removeItem("token");
    //           history.go(0);
    //         } else {
    //           reject();
    //         }
    //       });
    //   }).catch(() => {
    //     Swal.fire("Erreur!", "Une erreur est survenue", "error");
    //   });
  };

  const allDelete = () => {
    console.log("test");
  };
  const allDownload = () => {
    console.log("all dl");
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-4">
        <AllDeleteButton action={allDelete} />
        <CommonButton action={allDownload} text="Tout télécharger" />
      </div>
      <div className="flex space-x-3 items-center justify-center">
        <p className="text-gray-800 font-light ">
          Statut par defaut:{" "}
          <span>{defaultAllowPicture ? "Accepter" : "En attente"}</span>
        </p>
        <SwitchButton
          checked={defaultAllowPicture}
          onchange={changeDefaultAllowPicture}
        />
      </div>
    </div>
  );
}
