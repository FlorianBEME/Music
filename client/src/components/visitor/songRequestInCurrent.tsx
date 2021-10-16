import { useState } from "react";
import axios from "axios";
import { FETCH } from "../../FETCH";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { emitEvent } from "../common/socket";
import compare from "../common/sortMusic";

type SongRequestInCurrentProps = {
  isAllowed: boolean;
  refetch: Function;
  songs: any;
  isLoading: boolean;
};

export default function SongRequestInCurrent({
  isAllowed,
  refetch,
  songs,
  isLoading,
}: SongRequestInCurrentProps) {
  // Hook pour le rendu du composant
  function useForceUpdate() {
    //eslint-disable-next-line
    const [value, setValue] = useState(0); // integer state
    return () => setValue((value) => value + 1); // update the state to force render
  }

  const forceUpdate = useForceUpdate();

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
    if (isAllowed) {
      let newCount: number = count + 1;
      axios
        .put(`${FETCH}/currentSongs/${id}`, {
          countVote: newCount,
        })
        .then((result: object) => {
          if (
            localStorage.getItem("idMusicVoting") === null &&
            localStorage.getItem("date") === null
          ) {
            localStorage.setItem("idMusicVoting", JSON.stringify(id));
          } else {
            let oldId = localStorage.getItem("idMusicVoting");
            if (oldId !== null) {
              let result: string[] = oldId.split(",");
              result.push(id.toString());
              localStorage.removeItem("idMusicVoting");
              localStorage.setItem("idMusicVoting", JSON.stringify(result));
            }
          }
          emitEvent("update", "musiclist");
          refetch();
        });
      forceUpdate();
    } else {
      toast.error("Vous n'êtes pas autorisé!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const [compareType, setCompareType] = useState("voteup");

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
              <option disabled></option>
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
                .sort((song1: any, song2: any) => {
                  compare(song1, song2, compareType);
                })
                .map((song: any) => (
                  <li
                    key={song.id}
                    className=" flex items-center justify-between px-4 py-4 sm:px-6 flex-col md:flex-row"
                  >
                    <div className="flex sm:w-80 flex-col items-center md:items-start text-gray-800 dark:text-gray-100">
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
                          ) : !song.unavailable ? (
                            <div className="w-full md:w-28 col-start-2 col-span-2 inline-flex items-center justify-center px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-yellow-600 bg-yellow-100">
                              <div>Indisponible</div>
                            </div>
                          ) : !song.isValid ? (
                            <div className="w-full md:w-28 col-start-2 col-span-2 inline-flex items-center justify-center px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-600 bg-green-100">
                              <div>Validé</div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
            : null}
        </ul>
      </div>
    </div>
  );
}
