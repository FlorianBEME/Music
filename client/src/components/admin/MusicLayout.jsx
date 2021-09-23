import { useEffect, useState } from "react";
import axios from "axios";
import { FETCH } from "../../FETCH";
import { BsFillTrashFill } from "react-icons/bs";
import { CgUnavailable } from "react-icons/cg";
import { AiOutlineCheck } from "react-icons/ai";
import { removeInput } from "../common/removeInput";


import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const MusicLayout = () => {
  const token = localStorage.getItem("token");

  const [songs, setSongs] = useState([]);
  const [songsInCurrent, setSongsInCurrent] = useState(null);

  //Fecth liste de musique
  const fetchData = () => {
    axios
      .get(`${FETCH}/currentSongs`)
      .then((res) => {
        setSongs(res.data);
      })
      .catch(function (erreur) {
        console.log(erreur);
      });
  };

  // Suppression de la musique
  const handleDeleteMusic = (id) => {
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
        songs.forEach((song) => {
          axios
            .delete(`${FETCH}/currentsongs/${song.id}`, {
              headers: {
                "x-access-token": token,
              },
            })
            .then(() => {
              console.log("yes");

              Swal.fire("Suprimée!", "", "success");
            });
        });
      }
    });
  };

  const handleUnavailableMusic = (id) => {
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
            { unavailable: 1, isNew: 0, isValid: 0, countVote: -1 },
            {
              headers: {
                "x-access-token": token,
              },
            }
          )
          .then(() => {
            Swal.fire("Modifié!", "", "success");
          })
          .catch(function (error) {
            Swal.fire("Erreur!", "", "error");
          });
      }
    });
  };

  const handleValidMusic = (id) => {
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
          .then(() => {
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
        console.log(songsInCurrent);
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
          .then(() => {
            Swal.fire("Modifié!", "", "success");
            removeInput(["title"]);
            setSongsInCurrent("");
            console.log(songsInCurrent);
          })
          .catch(function (error) {
            Swal.fire("Erreur!", "", "error");
          });
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="w-full">
        <div className="flex justify-between mb-5">
          <div className="flex space-x-3">
            <input
              onChange={(e) => {
                setSongsInCurrent(e.target.value);
              }}
              type="text"
              name="title"
              id="title"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Titre en cours"
            />
            <button
              disabled={
                songsInCurrent === null || songsInCurrent === "" ? true : false
              }
              onClick={() => {
                handleChangeTitleInCurrent();
              }}
              type="button"
              className={
                songsInCurrent === null || songsInCurrent === ""
                  ? "inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-gray-700 bg-gray-100 cursor-not-allowed"
                  : "inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              }
            >
              Valider
            </button>
          </div>
          <button
            onClick={() => {
              handleAllDelete();
            }}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Tout supprimer
          </button>
        </div>
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Musique
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vote
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {songs.map((song) => (
                  <tr key={song.id}>
                    <td className=" py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {song.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {song.artist}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {song.isNew ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          En attente
                        </span>
                      ) : song.unavailable ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Indisponible
                        </span>
                      ) : song.isValid ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Validé
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {song.countVote >= 0 ? song.countVote : null}
                      </span>
                    </td>
                    <td className=" py-4 whitespace-nowrap ">
                      <div className="flex items-center justify-center flex-wrap">
                        <div
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer mx-2 my-1"
                          onClick={() => handleDeleteMusic(song.id)}
                        >
                          <BsFillTrashFill size={24} />
                        </div>
                        <div
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer mx-2 my-1"
                          onClick={() => handleUnavailableMusic(song.id)}
                        >
                          <CgUnavailable size={25} />

                          {/* <AiOutlineCheck size={25} /> */}
                        </div>
                        <div
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer mx-2 my-1"
                          onClick={() => handleValidMusic(song.id)}
                        >
                          {/* <CgUnavailable size={25} /> */}

                          <AiOutlineCheck size={25} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicLayout;
