import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";

import { FETCH } from "../../../FETCH";
import compare from "../../common/sortMusic";
import { incrementVote } from "../../../slicer/musicSlice";
import { emitEvent } from "../../common/socketio/SocketPublicComponent";

type SongRequestInCurrentProps = {
  isLoading: boolean;
  visitorId: Number | null;
  musicList: any[];
};

export default function SongRequestInCurrent({
  musicList,
  isLoading,
  visitorId,
}: SongRequestInCurrentProps) {
  const dispatch = useDispatch();

  const [compareType, setCompareType] = useState("default");
  const [songs, setSongs]: any = useState([]);

  // Fonction pour désactivé le vote
  const votingDisable = (id: number) => {
    let idVoting: any = localStorage.getItem("idMusicVoting");
    if (idVoting !== null) {
      return idVoting.includes(id);
    } else {
      return false;
    }
  };

  const handleVote = (id: number, count: number) => {
    let newCount: number = count + 1;
    // je modifie le compteur de vote de la musique
    axios
      .put(`${FETCH}/currentSongs/${id}`, {
        countVote: newCount,
        visitor_id: visitorId,
      })
      .then((result) => {
        // je recupere le nombre de fois que mon user à voté
        axios
          .get(`${FETCH}/visitor/${visitorId}`)
          .then((res) => {
            const visitor = { ...res.data[0] };
            const newCount = visitor.countVoting + 1;
            // je modifie le compteur de mon user
            axios
              .patch(`${FETCH}/visitor/newcount/${visitorId}`, {
                countvoting: newCount,
              })
              .then((res) => {
                // je modifie le local storage
                // Je vérifie si mon user a jamais voté
                if (
                  localStorage.getItem("idMusicVoting") === null &&
                  localStorage.getItem("date") === null
                ) {
                  localStorage.setItem("idMusicVoting", id.toString());
                } else {
                  // Si il a déja voté je récupere la liste des id, j'ajoute le nouveau et je modifie le localStorage
                  let oldId = localStorage.getItem("idMusicVoting");
                  if (oldId !== null) {
                    let result: Array<string> = oldId.split(",");
                    result.push(id.toString());
                    localStorage.removeItem("idMusicVoting");
                    localStorage.setItem("idMusicVoting", result.toString());
                  }
                }
                // Je met à jour le store
                dispatch(incrementVote(result.data));
                emitEvent("ADMIN", "increment-vote", {
                  id: visitorId,
                  countVoting: newCount,
                });
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          toast.error("Vous n'êtes pas autorisé!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.error("Erreur", { position: toast.POSITION.TOP_RIGHT });
        }
        console.error(error);
      });
  };

  useEffect(() => {
    if (isLoading) {
      setSongs([...musicList]);
    }
  }, [isLoading, musicList]);

  return (
    <div>
      {songs ? (
        songs.length > 0 ? (
          <div className="flex items-center justify-end space-x-2 my-4 ">
            <label
              htmlFor="location"
              className="block text-xs font-medium text-gray-700 dark:text-gray-200"
            >
              Trier:
            </label>
            <select
              defaultValue=""
              id="location"
              name="location"
              className="mt-1 block  pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={(e) => {
                setCompareType(e.target.value);
              }}
            >
              <option value="default">Récent</option>
              <option value="indispo">Indisponible</option>
              <option value="validé">Validé</option>
              <option value="voteup">Top vote</option>
            </select>
          </div>
        ) : null
      ) : null}

      <div className="bg-white dark:bg-gray-700 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-500">
          {isLoading
            ? songs
                .sort((a: any, b: any) => {
                  return compare(a, b, compareType);
                })
                .map((song: any, index: number) => (
                  <li
                    key={index}
                    className=" flex items-center justify-between px-4 py-4 sm:px-6 flex-col md:flex-row"
                  >
                    <div className="flex sm:w-80 flex-col items-center md:items-start text-gray-800 dark:text-gray-100">
                      <p className=" text-sm font-medium break-all text-center md:text-left">
                        {song.title}
                      </p>

                      <p className=" text-sm font-medium break-all text-center md:text-left">
                        {song.artist}
                      </p>
                      <p className="hidden md:block text-sm font-light break-all text-center md:text-left">
                        Proposé par{" "}
                        <span className="capitalize">{song.pseudo}</span>
                      </p>
                    </div>
                    <div
                      className={
                        song.countVote >= 0
                          ? "justify-between w-full sm:w-auto items-center flex flex-row mt-2 md:mt-0"
                          : "justify-center w-full sm:w-auto items-center flex flex-row mt-2 md:mt-0"
                      }
                    >
                      {song.countVote >= 0 ? (
                        <div className="px-4 ">
                          <p className="capitalize text-sm font-medium text-gray-500 dark:text-gray-400">
                            Vote: {song.countVote}
                          </p>
                        </div>
                      ) : null}
                      <div className="min-w-0  flex items-center">
                        <div className="min-w-0  px-4 md:grid md:grid-cols-3 md:gap-4">
                          {song.isNew ? (
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
                          ) : song.unavailable ? (
                            <div className="w-full md:w-28 col-start-2 col-span-2 inline-flex items-center justify-center px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-yellow-600 bg-yellow-100">
                              <div>Indisponible</div>
                            </div>
                          ) : song.isValid ? (
                            <div className="w-full md:w-28 col-start-2 col-span-2 inline-flex items-center justify-center px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-600 bg-green-100">
                              <div>Validé</div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800 dark:text-gray-100 mt-2 md:hidden text-sm font-light break-all text-center md:text-left">
                      Proposé par{" "}
                      <span className="capitalize">{song.pseudo}</span>
                    </p>
                  </li>
                ))
            : null}
        </ul>
      </div>
    </div>
  );
}
