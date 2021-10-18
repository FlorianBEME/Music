import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FETCH } from "../../../FETCH";
import { AiOutlineDownload } from "react-icons/ai";
import { FaRegCheckSquare } from "react-icons/fa";
import MusicBandeau from "../../../assets/musicbandeau.jpg";
import { v4 as uuidv4 } from "uuid";
import { emitEvent, subscribeToSocket } from "../../common/socket.js";
import { HexColorPicker } from "react-colorful";
import { useHistory } from "react-router-dom";

const MySwal = withReactContent(Swal);

const EventLayout = () => {
  const token = localStorage.getItem("token");
  const [dataLoad, setDataLoad] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    active_wall_picture: false,
    active_music_request: false,
  });
  const [eventCurrent, setEventCurrent] = useState<any>({});

  const [imagePreview, setImagePreview] = useState<any>({});

  const [currentFile, setCurrentFile] = useState<any>();
  const [color, setColor] = useState("#aabbcc");
  const [positionTitle, setPositionTitle] = useState("");

  const history = useHistory();

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
            .post(`${FETCH}/events`, {
              name: newEvent.name,
              active_music_request: newEvent.active_music_request,
              active_wall_picture: newEvent.active_wall_picture,
              uuid: uuidv4(),
            })
            .catch(function (error) {
              console.log(error);
            });
          Swal.fire("Créer!", "", "success");
          emitEvent("update", "event");
          fetchData();
        }
      });
    }
  };
  //fetch event
  const fetchData = () => {
    axios
      .get(`${FETCH}/events`)
      .then((response) => {
        setEventCurrent(response.data[0]);
        setDataLoad(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // suprimer un event et la donnée
  const handleRemove = () => {
    const token = localStorage.getItem("token");
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
            setEventCurrent([]);
            fetchData();
            emitEvent("update", "event");
          })
          .catch(() => {
            Swal.fire("Erreur!", "Une erreur est survenue", "error");
          });
      }
    });
  };
  // changement de l'image d'en-tête
  const changeImageTop = (e: any) => {
    e.preventDefault();
    MySwal.fire({
      title: "Êtes-vous sur de vouloir modifier l'image d'en-tête?",
      text: "Cela entraînera la suppression de l'ancienne image!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je suis sur !",
    }).then((result) => {
      if (result.isConfirmed) {
        new Promise((resolve, reject) => {
          let extension: string | undefined;
          if (currentFile) {
            extension = currentFile.name.split(".").pop();
          }

          const nameFile = "bg-music." + extension;

          const formData = new FormData();
          formData.append("file", currentFile);
          axios
            .post(
              `${FETCH}/upload/bg/${eventCurrent.id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  "x-access-token": token,
                },
              }
              // { oldFileName: eventCurrent.bg_music }
            )
            .then((res) => {
              axios
                .put(
                  `${FETCH}/events/${eventCurrent.id}`,
                  { bg_music: nameFile },
                  {
                    headers: {
                      "x-access-token": token,
                    },
                  }
                )
                .then(() => {
                  Swal.fire("Modifié!", "", "success");
                  resolve(res);
                })
                .catch(function (error) {
                  Swal.fire("Erreur!", "", "error");
                  reject(error);
                });
            })
            .catch(function (error) {
              reject(error);
            });
        })
          .then(() => {
            Swal.fire("Succés!", "L'image est changé", "success");
            emitEvent("update", "event");
          })
          .catch(() => {
            Swal.fire("Erreur!", "Une erreur est survenue", "error");
          });
      }
    });
  };
  // preview image
  const handleImageChange = (e: any) => {
    if (e.target.files[0] !== undefined) {
      let reader = new FileReader();
      let file = e.target.files[0];

      reader.onloadend = () => {
        setImagePreview({
          file: file,
          imagePreviewUrl: reader.result,
        });
      };

      setCurrentFile(file);
      reader.readAsDataURL(file);
    } else {
      setImagePreview({
        file: null,
        imagePreviewUrl: null,
      });
    }
  };
  // modifier les permissions d'accès
  const handleChangeAcces = () => {
    if (
      !eventCurrent.active_music_request &&
      !eventCurrent.active_wall_picture
    ) {
      Swal.fire("Erreur!", "Sélectionner au moins une catégorie", "error");
    } else {
      MySwal.fire({
        title: "Êtes-vous sur ?",
        text: "Cela modifira les acccès au fonctionnalitées",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, je suis sur !",
      }).then((result) => {
        if (result.isConfirmed) {
          new Promise((resolve, reject) => {
            axios
              .put(`${FETCH}/events/${eventCurrent.id}`, eventCurrent, {
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
              Swal.fire("Modifié!", "L'évenement est modifié", "success");
              setEventCurrent(null);
              fetchData();
              emitEvent("update", "event");
            })
            .catch(() => {
              Swal.fire("Erreur!", "Une erreur est survenue", "error");
            });
        }
      });
    }
  };
  //modifier position du titre
  const handleChangePositionTitle = () => {
    MySwal.fire({
      title: "Êtes-vous sur ?",
      text: "Cela modifira la position du titre",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je suis sur !",
    }).then((result) => {
      if (result.isConfirmed) {
        new Promise((resolve, reject) => {
          axios
            .put(
              `${FETCH}/app/titleEventappStyle/position/0`,
              { position: positionTitle },
              {
                headers: {
                  "x-access-token": token,
                },
              }
            )
            .then((res) => {
              console.log(res);
              resolve(res);
            })
            .catch((error) => {
              if (error.response.status === 401) {
                localStorage.removeItem("token");
                history.go(0);
              } else {
                reject();
              }
            });
        }).then((res: any) => {
          console.log(res.data);
          Swal.fire("Modifié!", "L'évenement est modifié", "success");
          fetchTitleEvent();
          emitEvent("update", "settitle");
        });
      }
    });
  };
  //modifier color du titre
  const handleChangeColorTitle = () => {
    MySwal.fire({
      title: "Êtes-vous sur ?",
      text: "Cela modifira la couleur du titre",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je suis sur !",
    }).then((result) => {
      if (result.isConfirmed) {
        new Promise((resolve, reject) => {
          axios
            .put(
              `${FETCH}/app/titleEventappStyle/color/0`,
              { color: color },
              {
                headers: {
                  "x-access-token": token,
                },
              }
            )
            .then((res) => {
              resolve(res);
            })
            .catch(function (error) {
              if (error.response.status === 401) {
                localStorage.removeItem("token");
                history.go(0);
              } else {
                reject();
              }
            });
        })
          .then(() => {
            Swal.fire("Modifié!", "L'évenement est modifié", "success");
            fetchTitleEvent();
            emitEvent("update", "settitle");
          })
          .catch(() => {
            Swal.fire("Erreur!", "Une erreur est survenue", "error");
          });
      }
    });
  };
  //fetch style du titre
  const fetchTitleEvent = () => {
    axios
      .get(`${FETCH}/app/app`)
      .then((res) => {
        setColor(res.data.titleEventappStyle.color);
        setPositionTitle(res.data.titleEventappStyle.position);
      })
      .catch(function (erreur) {
        console.log(erreur);
      });
  };

  // fetchData();
  useEffect(() => {
    fetchData();
    fetchTitleEvent();
  }, []);

  // socket;
  useEffect(() => {
    subscribeToSocket((args: string) => {
      if (args === "settitle") {
        console.log("je recoit");
        fetchTitleEvent();
      }
    });
  }, []);

  return (
    <div>
      {dataLoad ? (
        eventCurrent === null || eventCurrent === undefined ? null : (
          <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Accès
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
                <p>Gérer l'accès au fonctionnalitées</p>
              </div>
              <div className="">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChangeAcces();
                  }}
                >
                  <fieldset className="space-y-5">
                    <legend className="sr-only">Notifications</legend>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="active_music_request"
                          aria-describedby="comments-description"
                          name="active_music_request"
                          type="checkbox"
                          onChange={(e) => {
                            setEventCurrent({
                              ...eventCurrent,
                              [e.target.name]:
                                !eventCurrent.active_music_request,
                            });
                          }}
                          defaultChecked={
                            eventCurrent.active_music_request === 1
                              ? true
                              : false
                          }
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
                        <p
                          id="comments-description"
                          className="text-gray-500 dark:text-gray-400"
                        >
                          {/* Get notified when someones posts a comment on a
                          posting. */}
                        </p>
                      </div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          onChange={(e) => {
                            setEventCurrent({
                              ...eventCurrent,
                              [e.target.name]:
                                !eventCurrent.active_wall_picture,
                            });
                          }}
                          defaultChecked={
                            eventCurrent.active_wall_picture === 1
                              ? true
                              : false
                          }
                          id="active_wall_picture"
                          aria-describedby="active_wall_picture"
                          name="active_wall_picture"
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
                        <p
                          id="candidates-description"
                          className="text-gray-500 dark:text-gray-400"
                        >
                          {/* Get notified when a candidate applies for a job. */}
                        </p>
                      </div>
                    </div>
                  </fieldset>
                  <button
                    type="submit"
                    className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-5  sm:w-auto sm:text-sm"
                  >
                    Modifier
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      ) : null}

      {dataLoad ? (
        eventCurrent === null || eventCurrent === undefined ? null : (
          <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg my-2.5">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Modifier la position
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
                <p>Modifier pour changer la position du titre</p>
              </div>
              <div className=" flex items-start">
                <form
                  className="space-y-5 mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChangePositionTitle();
                  }}
                >
                  <div className=" flex items-center space-x-4">
                    <select
                      defaultValue={positionTitle}
                      id="location"
                      name="location"
                      className=" block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      onChange={(e) => {
                        setPositionTitle(e.target.value);
                      }}
                    >
                      <option value="left">Gauche</option>
                      <option value="center">Centré</option>
                      <option value="right">Droite</option>
                    </select>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500   sm:w-auto sm:text-sm"
                    >
                      Modifier
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="px-4 pb-7 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Modifier la couleur
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
                <p>Modifier pour changer la couleur du titre</p>
              </div>
              <div className=" flex items-start">
                <form
                  className="space-y-5 mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChangeColorTitle();
                  }}
                >
                  <div className=" flex items-end space-x-4">
                    <HexColorPicker color={color} onChange={setColor} />
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500   sm:w-auto sm:text-sm"
                    >
                      Modifier
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      ) : null}

      {dataLoad ? (
        eventCurrent === null || eventCurrent === undefined ? (
          <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium dark:text-white text-gray-900">
                Nouvel Event
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Saisir le titre de l'évenement. Attention celui-ci sera
                  affiché sur la page d'accueil.
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
                        {/* <p
                          id="comments-description"
                          className="text-gray-500 dark:text-gray-400"
                        >
                          Get notified when someones posts a comment on a
                          posting.
                        </p> */}
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
                        {/* <p
                          id="candidates-description"
                          className="text-gray-500 dark:text-gray-400"
                        >
                          Get notified when a candidate applies for a job.
                        </p> */}
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
        ) : (
          <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg my-2.5">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Suppression
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
                <p>
                  En supprimant l'évenement vous supprimer toutes les données
                  liées.
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
        )
      ) : null}

      {eventCurrent === null || eventCurrent === undefined ? null : (
        <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg my-2.5">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Image d'en-tete
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
              <p>Modifier l'image d'en-tête</p>
            </div>
            <div className="flex justify-between flex-col sm:flex-row">
              <form
                className="mt-5 flex items-center space-x-4"
                onSubmit={(e) => changeImageTop(e)}
              >
                <div className=" sm:max-w-xs">
                  <label
                    htmlFor="file-upload"
                    className={
                      imagePreview.file !== null
                        ? "flex justify-between items-center cursor-pointer px-4 py-2 border-2 border-green-600 rounded-md w-28 "
                        : "flex justify-between items-center cursor-pointer px-4 py-2 border-2 border-gray-300 rounded-md w-28 "
                    }
                  >
                    <i className="">
                      {imagePreview.file !== null ? (
                        <FaRegCheckSquare
                          size={20}
                          className="text-green-600"
                        />
                      ) : (
                        <AiOutlineDownload
                          size={20}
                          className="text-gray-600 dark:text-white"
                        />
                      )}
                    </i>
                    <span
                      className={
                        imagePreview.file !== null
                          ? "text-green-600"
                          : "text-gray-600 dark:text-white"
                      }
                    >
                      Upload
                    </span>
                  </label>
                  <input
                    accept=".png,.jpeg,.gif,.jpg"
                    onChange={(e) => {
                      handleImageChange(e);
                    }}
                    id="file-upload"
                    type="file"
                    className="hidden"
                  />
                </div>
                <button
                  disabled={imagePreview.file === null}
                  type="submit"
                  className={
                    imagePreview.file !== null
                      ? "text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md sm:ml-3 sm:w-auto sm:text-sm"
                      : " cursor-not-allowed text-white bg-gray-400 inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md sm:ml-3 sm:w-auto sm:text-sm"
                  }
                >
                  Modifier
                </button>
              </form>
              {currentFile !== null || currentFile !== undefined ? (
                <img
                  alt="banniere"
                  className="w-52 rounded-sm mt-2 sm:mt-0 self-center"
                  src={
                    imagePreview.imagePreviewUrl
                      ? imagePreview.imagePreviewUrl
                      : eventCurrent.bg_music !== null
                      ? `/uploads/${eventCurrent.bg_music}`
                      : MusicBandeau
                  }
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventLayout;
