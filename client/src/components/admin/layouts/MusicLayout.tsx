import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ReactElement } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { BsFillTrashFill } from "react-icons/bs";
import { CgUnavailable } from "react-icons/cg";
import { AiOutlineCheck } from "react-icons/ai";

import { FETCH } from "../../../FETCH";
import { removeInput } from "../../common/removeInput";
import compare from "../../common/sortMusic";
import AllDeleteButton from "../../common/button/AllDeleteButton";
import { emitEvent } from "../../common/socketio/SocketPublicComponent";
import {
  musicIsLoading,
  musicList,
  removeAllMusic,
  removeMusic,
  updateStatusMusic,
} from "../../../slicer/musicSlice";

import { appParam, udpdateSongInCurrent } from "../../../slicer/appSlice";

const MySwal = withReactContent(Swal);

type MusicLayoutProps = {
  event: any;
};

export default function MusicLayout({ event }: MusicLayoutProps): ReactElement {
  const dispatch = useDispatch();
  const isLoading = useSelector(musicIsLoading);
  const musics = useSelector(musicList);
  const app = useSelector(appParam);
  const token = localStorage.getItem("token");

  const [compareType, setCompareType] = useState("default");
  const [songs, setSongs] = useState<any>([]);

  const [songsInCurrent, setSongsInCurrent] = useState({
    artist: "",
    title: "",
  });

  useEffect(() => {
    if (isLoading) {
      setSongs([...musics]);
    }
  }, [isLoading, musics]);

  // Suppression de la musique
  const handleDeleteMusic = (id: number) => {
    MySwal.fire({
      title: `Êtes-vous sûr de vouloir supprimer cette chanson?`,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${FETCH}/currentsongs/${id}`, {
            headers: {
              "x-access-token": token,
            },
          })
          .then(() => {
            Swal.fire("Suprimée!", "", "success");
            emitEvent("update", "music-remove", id);
            dispatch(removeMusic(id));
          })
          .catch(function (error) {
            Swal.fire("Erreur!", "", "error");
          });
      }
    });
  };

  // Suppression de toute les musiques
  const handleAllDelete = () => {
    MySwal.fire({
      title: `Êtes-vous sûr de vouloir supprimer toutes les chansons?`,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${FETCH}/currentsongs/remove/all`, {
            headers: {
              "x-access-token": token,
            },
          })
          .then(() => {
            Swal.fire("Suprimée!", "", "success");
            emitEvent("update", "music-remove-all");
            dispatch(removeAllMusic());
          });
      }
    });
  };

  // Changer status music
  const handleUnavailableMusic = (id: number) => {
    MySwal.fire({
      title: `Êtes-vous sûr de vouloir mettre cette chanson en indisponible?`,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${FETCH}/currentsongs/${id}`,
            { unavailable: 1, isNew: 0, isValid: 0 },
            {
              headers: {
                "x-access-token": token,
              },
            }
          )
          .then((res) => {
            Swal.fire("Modifié!", "", "success");
            const data = {
              status: {
                unavailable: res.data.unavailable,
                isNew: res.data.isNew,
                isValid: res.data.isValid,
              },
              id: res.data.id,
            };
            dispatch(updateStatusMusic(data));
            emitEvent("update", "music-status", data);
          })
          .catch(function (error) {
            Swal.fire("Erreur!", "", "error");
          });
      }
    });
  };
  const handleValidMusic = (id: number) => {
    MySwal.fire({
      title: `Êtes-vous sûr de vouloir mettre cette chanson en validé?`,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${FETCH}/currentsongs/${id}`,
            { unavailable: 0, isNew: 0, isValid: 1, countVote: -1 },
            {
              headers: {
                "x-access-token": token,
              },
            }
          )
          .then((res) => {
            const data = {
              status: {
                unavailable: res.data.unavailable,
                isNew: res.data.isNew,
                isValid: res.data.isValid,
              },
              id: res.data.id,
            };
            dispatch(updateStatusMusic(data));
            emitEvent("update", "music-status", data);
            Swal.fire("Modifié!", "", "success");
          })
          .catch(function (error) {
            Swal.fire("Erreur!", "", "error");
          });
      }
    });
  };
  // changer titre en cours
  const handleChangeTitleInCurrent = () => {
    MySwal.fire({
      title: `Êtes-vous sûr de vouloir modifier le titre en cours ?`,
      showCancelButton: true,
      confirmButtonText: "Valider",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `${FETCH}/app/songinprogress/0`,
            { titleincurent: songsInCurrent },
            {
              headers: {
                "x-access-token": token,
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              Swal.fire("Modifié!", "", "success");
              emitEvent("update", "song-in-current", songsInCurrent);
              dispatch(udpdateSongInCurrent(songsInCurrent));
              removeInput(["artist", "title"]);
            }
          })
          .catch(function (error) {
            Swal.fire("Erreur!", "", "error");
          });
      }
    });
  };

  return (
    <div>
      <div className="hidden  sm:flex flex-col ">
        {!event.isLoad ? (
          <div className="w-full flex justify-center items-center">
            <p className="dark:text-gray-100 py-52">Pas d'évenement en cours</p>
          </div>
        ) : event.active_music_request ? (
          <div>
            <div className="w-full">
              {/* top */}
              <div className="flex justify-between mb-5">
                <div className="flex space-x-3">
                  <input
                    onChange={(e) => {
                      setSongsInCurrent({
                        ...songsInCurrent,
                        title: e.target.value,
                      });
                    }}
                    type="text"
                    name="title"
                    id="title"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={app.app.titleincurent.title}
                  />
                  <input
                    onChange={(e) => {
                      setSongsInCurrent({
                        ...songsInCurrent,
                        artist: e.target.value,
                      });
                    }}
                    type="text"
                    name="artist"
                    id="artist"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder={app.app.titleincurent.artist}
                  />
                  <button
                    disabled={
                      songsInCurrent.artist === "" ||
                      songsInCurrent.title === ""
                        ? true
                        : false
                    }
                    onClick={() => {
                      handleChangeTitleInCurrent();
                    }}
                    type="button"
                    className={
                      songsInCurrent.artist === "" ||
                      songsInCurrent.title === ""
                        ? "inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-gray-700 bg-gray-100 cursor-not-allowed dark:bg-gray-500 dark:text-gray-200"
                        : "inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-green-700 dark:bg-green-700 dark:text-green-100 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    }
                  >
                    Valider
                  </button>
                </div>
                <div className="flex items-center space-x-2">
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
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
              </div>
            </div>
            {/* Table */}
            <div className="sm:-my-2 sm:overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr className="text-gray-500 dark:text-gray-50">
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        >
                          Musique
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        >
                          Vote
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        >
                          Par
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-400 dark:divide-white divide-y divide-gray-200">
                      {songs
                        .sort((a: any, b: any) => {
                          return compare(a, b, compareType);
                        })
                        .map((song: any) => (
                          <tr key={song.id}>
                            <td className=" py-4 ">
                              <div className="flex items-center">
                                <div className="ml-4  max-w-xl overflow-auto">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white 	">
                                    {song.title}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-300">
                                    {song.artist}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {song.isNew ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:text-gray-100 dark:bg-gray-800">
                                  En attente
                                </span>
                              ) : song.unavailable ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                                  Indisponible
                                </span>
                              ) : song.isValid ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                  Validé
                                </span>
                              ) : null}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-500 dark:text-gray-200">
                                {song.countVote >= 0 ? song.countVote : null}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-500 dark:text-gray-200">
                                {song.pseudo}
                              </span>
                            </td>
                            <td className=" py-4 whitespace-nowrap ">
                              <div className="flex items-center justify-center flex-wrap text-indigo-600 hover:text-indigo-900 dark:text-blue-700">
                                <div
                                  className="cursor-pointer mx-2 my-1"
                                  onClick={() => handleDeleteMusic(song.id)}
                                >
                                  <BsFillTrashFill size={24} />
                                </div>
                                <div
                                  className={
                                    song.unavailable
                                      ? "text-gray-400 mx-2 my-1"
                                      : "cursor-pointer mx-2 my-1"
                                  }
                                  onClick={() =>
                                    !song.unavailable
                                      ? handleUnavailableMusic(song.id)
                                      : null
                                  }
                                >
                                  <CgUnavailable size={25} />
                                </div>
                                <div
                                  className={
                                    song.isValid
                                      ? "text-gray-400 mx-2 my-1"
                                      : "cursor-pointer mx-2 my-1"
                                  }
                                  onClick={() =>
                                    !song.isValid
                                      ? handleValidMusic(song.id)
                                      : null
                                  }
                                >
                                  <AiOutlineCheck size={25} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-5">
                  <AllDeleteButton action={handleAllDelete} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center">
            <p className="dark:text-gray-100 py-52">
              Fonctionnalitée désactivée
            </p>
          </div>
        )}
      </div>
      <div className="sm:hidden flex justify-center  items-center">
        <p className="text-gray-700 dark:text-white text-center">
          Fonctionnalité actuellement indisponible pour ce format d'écran
        </p>
      </div>
    </div>
  );
}

// export default MusicLayout;
