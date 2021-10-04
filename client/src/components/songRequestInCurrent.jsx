import { useState } from "react";
import axios from "axios";
import { FETCH } from "../FETCH";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { emitEvent } from "./common/socket";

export default function SongRequestInCurrent(props) {
  // Hook pour le rendu du composant
  function useForceUpdate() {
    //eslint-disable-next-line
    const [value, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update the state to force render
  }

  const forceUpdate = useForceUpdate();

  // Fonction pour désactivé le vote
  const votingDisable = (id) => {
    let idVoting = localStorage.getItem("idMusicVoting");
    if (idVoting !== null) {
      return idVoting.includes(id);
    } else {
      return false;
    }
  };

  const handleVote = (id, count) => {
    if (props.isAllowed) {
      let newCount = parseInt(count) + 1;
      axios
        .put(`${FETCH}/currentSongs/${id}`, {
          countVote: newCount,
        })
        .then((result, err) => {
          if (
            localStorage.getItem("idMusicVoting") === null &&
            localStorage.getItem("date") === null
          ) {
            localStorage.setItem("idMusicVoting", id);
          } else {
            let oldId = localStorage.getItem("idMusicVoting");
            if (oldId !== null) {
              let result = oldId.split(",");
              result.push(id);
              localStorage.removeItem("idMusicVoting");
              localStorage.setItem("idMusicVoting", result);
            }
          }

          emitEvent("update", "musiclist");
          props.refetch();
        });
      forceUpdate();
    } else {
      toast.error("Vous n'êtes pas autorisé!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200 dark:divide-gray-500">
        {props.isLoading
          ? props.songs.map((song) => (
              <li key={song.id}>
                <div className=" flex items-center justify-between px-4 py-4 sm:px-6 flex-col md:flex-row">
                  <div className="flex flex-col items-center md:items-start text-gray-800 dark:text-gray-100">
                    <p className=" text-sm font-medium break-all text-center md:text-left">
                      {song.title}
                    </p>

                    <p className=" text-sm font-medium break-all text-center md:text-left">
                      {song.artist}
                    </p>
                    <p className=" text-sm font-light break-all text-center md:text-left">
                      Proposé par{" "}
                      <span className="capitalize">{song.pseudo}</span>
                    </p>
                  </div>

                  <div className="flex flex-row mt-2 md:mt-0">
                    {song.countVote >= 0 ? (
                      <div className="flex items-center">
                        <div className="px-4 ">
                          <p className="capitalize text-sm font-medium text-gray-500 dark:text-gray-400">
                            Vote: {song.countVote}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                        {song.isNew === 1 ? (
                          votingDisable(song.id) ? (
                            <div className="w-full md:w-28 col-start-2 col-span-2 inline-flex items-center justify-center px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-400 bg-gray-100">
                              Voté!
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                handleVote(song.id, song.countVote)
                              }
                              type="button"
                              className="w-full md:w-28 col-start-2 col-span-2 inline-flex items-center justify-center px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Voter
                            </button>
                          )
                        ) : song.unavailable === 1 ? (
                          <div className="w-full md:w-28 col-start-2 col-span-2 inline-flex items-center justify-center px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-yellow-600 bg-yellow-100">
                            <div>Indisponible</div>
                          </div>
                        ) : song.isValid === 1 ? (
                          <div className="w-full md:w-28 col-start-2 col-span-2 inline-flex items-center justify-center px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-600 bg-green-100">
                            <div>Validé</div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
