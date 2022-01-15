import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

import { FETCH } from "../../../FETCH";
import { removeInput } from "../../common/removeInput";
import { emitEvent } from "../../common/SocketPublicComponent";
import {
  deleteAppTextBanner,
  updateAppTextBanner,
} from "../../../slicer/appSlice";
import { appParam } from "../../../slicer/appSlice";

const MySwal = withReactContent(Swal);

export const TextBannerModify = () => {
  const token = localStorage.getItem("token");
  const eventSetting = useSelector(appParam);

  const dispatch = useDispatch();
  const history = useHistory();

  const [textBanner, setTextBanner] = useState("");
  const [oldText, setoldText] = useState("Saisir votre Texte");

  useEffect(() => {
    if (eventSetting.app.textbanner != null) {
      setoldText(eventSetting.app.textbanner);
    } else {
      setoldText("Saisir votre Texte");
    }
  }, [eventSetting]);

  const modifyTextBanner = () => {
    MySwal.fire({
      title: "Êtes-vous sur ?",
      text: "Cela modifira le texte de la bannière",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Modifier",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${FETCH}/app/textbanner/0`,
            { data: textBanner },
            {
              headers: {
                "x-access-token": token,
              },
            }
          )
          .then((res) => {
            dispatch(updateAppTextBanner(res.data));
            removeInput(["inputTextbanner"]);
            emitEvent("update", "banner", res.data);
          })
          .catch((error) => {
            if (error.response.status === 401) {
              localStorage.removeItem("token");
              history.go(0);
            } else {
              Swal.fire("Erreur!", "Une erreur est survenue", "error");
            }
          });
      }
    });
  };

  const deleteTextBanner = () => {
    MySwal.fire({
      title: "Êtes-vous sur ?",
      text: "Cela suprimera le texte de la bannière",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Supprimer",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${FETCH}/app/textbanner/0`,
            { data: null },
            {
              headers: {
                "x-access-token": token,
              },
            }
          )
          .then(() => {
            dispatch(deleteAppTextBanner());
            emitEvent("update", "banner");
            removeInput(["inputTextbanner"]);
          })
          .catch((err) => {
            if (err.response.status === 401) {
              localStorage.removeItem("token");
              history.go(0);
            } else {
              Swal.fire("Erreur!", "Une erreur est survenue", "error");
            }
          });
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Texte Bannière
        </h3>
        <div className="mt-2 mb-4 max-w-xl text-sm text-gray-500 dark:text-gray-200">
          <p>Modifier le texte de la bannière</p>
        </div>
        <div className="">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              modifyTextBanner();
            }}
          >
            <fieldset className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex items-center w-full">
                  <textarea
                    required
                    onChange={(e) => {
                      setTextBanner(e.target.value);
                    }}
                    placeholder={oldText}
                    id="inputTextbanner"
                    className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block  min-w-0 rounded-lg sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </fieldset>
            <div className="flex flex-col sm:flex-row sm:space-x-3">
              <button
                type="submit"
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-5  sm:w-auto sm:text-sm"
              >
                Modifier
              </button>
              {eventSetting.app.textbanner === null ? null : (
                <button
                  onClick={() => {
                    deleteTextBanner();
                  }}
                  type="button"
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm dark:bg-red-800 dark:text-red-200 sm:mt-5  sm:w-auto sm:text-sm"
                >
                  Supprimer
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
