import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";

import { updateEventInStore } from "../../../slicer/eventSlice";
import { FETCH } from "../../../FETCH";
import { emitEvent } from "../../common/SocketPublicComponent";

const MySwal = withReactContent(Swal);

export interface IAppProps {
  token: string | null;
  refetch: Function;
}

export function AddNewEvent(props: IAppProps) {
  const dispatch = useDispatch();

  const [newEvent, setNewEvent] = useState({
    name: "",
    active_wall_picture: false,
    active_music_request: false,
  });

  // ajout d'un nouvel event
  const addNewEvent = (e: any) => {
    e.preventDefault();
    if (!newEvent.active_music_request && !newEvent.active_wall_picture) {
      Swal.fire("Erreur!", "Sélectionner au moins une catégorie", "error");
    } else {
      MySwal.fire({
        title: `Êtes-vous sûr de vouloir créer l'évenement ${newEvent.name}?`,
        showCancelButton: true,
        confirmButtonText: "Valider",
        cancelButtonText: "Annuler",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(
              `${FETCH}/events`,
              {
                bg_music: null,
                name: newEvent.name,
                active_music_request: newEvent.active_music_request,
                active_wall_picture: newEvent.active_wall_picture,
                uuid: uuidv4(),
              },
              {
                headers: {
                  "x-access-token": props.token,
                },
              }
            )
            .then((res) => {
              console.log(res.data);
              dispatch(updateEventInStore(res.data));
              emitEvent("update", "event", res.data);
              Swal.fire("Créer!", "", "success");
            })
            .catch(function (error) {
              console.error(error);
            });
        }
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg my-2.5">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium dark:text-white text-gray-900">
          Nouvel Event
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Saisir le titre de l'évenement. Attention celui-ci sera affiché sur
            la page d'accueil.
          </p>
        </div>
        <form className="mt-5 " onSubmit={(e) => addNewEvent(e)}>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="name" className="sr-only">
              Nom de l'évenement
            </label>
            <input
              required
              onChange={(e) =>
                setNewEvent({ ...newEvent, name: e.target.value })
              }
              type="text"
              name="eventName"
              id="eventName"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Romain's birthday"
            />
          </div>
          <div className="">
            <fieldset className="space-y-5">
              <legend className="sr-only">Notifications</legend>
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="comments"
                    aria-describedby="comments-description"
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        active_music_request: e.target.checked,
                      })
                    }
                    name="comments"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="comments"
                    className="font-medium text-gray-700 dark:text-white"
                  >
                    Music Request
                  </label>
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="candidates"
                    aria-describedby="candidates-description"
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        active_wall_picture: e.target.checked,
                      })
                    }
                    name="candidates"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="candidates"
                    className="font-medium text-gray-700 dark:text-white"
                  >
                    Wall Picture
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <button
            type="submit"
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-5  sm:w-auto sm:text-sm"
          >
            Créer
          </button>
        </form>
      </div>
    </div>
  );
}
