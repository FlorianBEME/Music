import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";

import { useDispatch } from "react-redux";


import { FETCH } from "../../../FETCH";
import { emitEvent } from "../../common/socketio/SocketPublicComponent";
import { deleteEvent } from "../../../slicer/eventSlice";
import { initMusicStore } from "../../../slicer/musicSlice";

const MySwal = withReactContent(Swal);

export function DeleteEvent() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  // suprimer un event et la donnée
  const handleRemove = () => {
    MySwal.fire({
      title: "Êtes-vous sur ?",
      text: "Cela entraînera la suppression des données",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je suis sur !",
    }).then((result) => {
      if (result.isConfirmed) {
        new Promise((resolve, reject) => {
          axios
            .delete(`${FETCH}/events/remove/all`, {
              headers: {
                "x-access-token": token,
              },
            })
            .then((res) => {
              resolve(res);
            })
            .catch(function (error) {
              reject(error);
            });
        })
          .then(() => {
            Swal.fire("Suprimé!", "L'évenement est supprimé", "success");
            dispatch(deleteEvent());
            dispatch(initMusicStore([]));
            emitEvent("update", "event-delete");
          })
          .catch(() => {
            Swal.fire("Erreur!", "Une erreur est survenue", "error");
          });
      }
    });
  };
  return (
    <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg my-2.5">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Suppression
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
          <p>
            En supprimant l'évenement vous supprimer toutes les données liées.
          </p>
        </div>
        <div className="mt-5">
          <button
            onClick={() => handleRemove()}
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm dark:bg-red-800 dark:text-red-200"
          >
            Supprimer l'évenement
          </button>
        </div>
      </div>
    </div>
  );
}
