import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { FETCH } from "../../../FETCH";
// import { v4 as uuidv4 } from "uuid";
import { emitEvent, subscribeToSocket } from "../../common/socket";
import { HexColorPicker } from "react-colorful";
import { useHistory } from "react-router-dom";
import FooterSettings from "../event/FooterSettings";
import { Backgroundheader } from "../event/Backgroundheader";
import { AddNewEvent } from "../event/AddNewEvent";
import { DeleteEvent } from "../event/DeleteEvent";

const MySwal = withReactContent(Swal);

const EventLayout = () => {
  const token = localStorage.getItem("token");
  const [dataLoad, setDataLoad] = useState(false);
  // const [newEvent, setNewEvent] = useState({
  //   name: "",
  //   active_wall_picture: false,
  //   active_music_request: false,
  // });
  const [eventCurrent, setEventCurrent] = useState<any>({});

  const [color, setColor] = useState("#aabbcc");
  const [positionTitle, setPositionTitle] = useState("");

  const history = useHistory();

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
    console.log("test title reftch");
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
        eventCurrent === null || eventCurrent === undefined ? (
          <AddNewEvent token={token} refetch={() => fetchData()} />
        ) : null
      ) : null}

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

      {dataLoad ? <FooterSettings /> : null}

      {dataLoad ? (
        eventCurrent === null || eventCurrent === undefined ? null : (
          <Backgroundheader event={eventCurrent} token={token} />
        )
      ) : null}

      {dataLoad ? (
        eventCurrent === null || eventCurrent === undefined ? null : (
          <DeleteEvent
            token={token}
            event={eventCurrent}
            refetch={() => fetchData()}
          />
        )
      ) : null}
    </div>
  );
};

export default EventLayout;
