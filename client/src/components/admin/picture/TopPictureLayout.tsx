import React, { ReactElement, useState, useEffect } from "react";
import AllDeleteButton from "../../common/button/AllDeleteButton";
import CommonButton from "../../common/button/ComonButton";
import SwitchButton from "../../common/button/SwitchButton";

import axios from "axios";
import { FETCH } from "../../../FETCH";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);

type TopPictureLayoutProp = {
  token: string | null;
};

export default function TopPictureLayout({
  token,
}: TopPictureLayoutProp): ReactElement {
  const [defaultPictureAccept, setDefaultPictureAccept] = useState(false);

  useEffect(() => {
    // axios.get(`${FETCH}/app/app`).then((res) => {
    //   setDefaultPictureAccept(res.data.app.defaultPictureAccept);
    // });
  }, []);

  const changeDefaultAllowPicture = () => {
    new Promise((resolve, reject) => {
      axios
        .put(
          `${FETCH}/app/app/defaultpictureaccept/0"`,
          { defaultPictureAccept: !defaultPictureAccept },
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((res) => {
          setDefaultPictureAccept(!defaultPictureAccept);
          resolve(res);
        })
        .catch(function (error) {
          if (error.response.status === 401) {
            // localStorage.removeItem("token");
            // history.go(0);
          } else {
            reject();
          }
        });
    }).catch(() => {
      Swal.fire("Erreur!", "Une erreur est survenue", "error");
    });
  };

  const allDelete = () => {
    axios({
      url: `${FETCH}/eventpicture/cleanpicture`,
      method: "DELETE",
      responseType: "blob",
    }).then((response) => {
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Photos.zip");
      document.body.appendChild(link);
      link.click();
    });
  };
  const allDownload = () => {
    axios({
      url: `${FETCH}/eventpicture/download`,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Photos.zip");
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-3 items-center justify-center">
        <p className="text-gray-800 font-light ">
          Statut par defaut:{" "}
          <span>{defaultPictureAccept ? "Accepter" : "En attente"}</span>
        </p>
        <SwitchButton
          checked={defaultPictureAccept}
          onchange={changeDefaultAllowPicture}
        />
      </div>
      <div className="flex space-x-4">
        <AllDeleteButton action={allDelete} />
        <CommonButton action={allDownload} text="Tout télécharger" />
      </div>
    </div>
  );
}
