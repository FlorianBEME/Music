import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { HexColorPicker } from "react-colorful";
import { useHistory } from "react-router-dom";
import { Switch } from "@headlessui/react";

import { useSelector } from "react-redux";
import { eventStore } from "../../../../slicer/eventSlice";
import { appParam } from "../../../../slicer/appSlice";

import { FETCH } from "../../../../FETCH";
import FooterSettings from "../../event/FooterSettings";
import { Backgroundheader } from "../../event/Backgroundheader";
import { AddNewEvent } from "../../event/AddNewEvent";
import { DeleteEvent } from "../../event/DeleteEvent";
import { TextBannerModify } from "../../event/TextBannerModify";
import { emitEvent } from "../../../common/socketio/SocketPublicComponent";
import { updateEventInStore } from "../../../../slicer/eventSlice";
import { updateAppTitleStyle } from "../../../../slicer/appSlice";

// Switch
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const MySwal = withReactContent(Swal);

const EventLayout = () => {
  const dispatch = useDispatch();
  const event = useSelector(eventStore);
  const eventSetting = useSelector(appParam);
  const token = localStorage.getItem("token");

  const [eventCurrent, setEventCurrent] = useState<any>({
    active_music_request: false,
    active_wall_picture: false,
  });

  const [color, setColor] = useState("#aabbcc");
  const [positionTitle, setPositionTitle] = useState("");
  const [displayTitle, setDisplayTitle] = useState(true);

  const history = useHistory();

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
          console.log(eventCurrent);
          const newData = {
            active_music_request: eventCurrent.active_music_request,
            active_wall_picture: eventCurrent.active_wall_picture,
            bg_music: eventCurrent.bg_music,
            name: eventCurrent.name,
            uuid: eventCurrent.uuid,
          };
          axios
            .put(`${FETCH}/events/${event.id}`, newData, {
              headers: {
                "x-access-token": token,
              },
            })
            .then((res) => {
              dispatch(updateEventInStore(res.data));
              emitEvent("update", "event", res.data);
              Swal.fire("Modifié!", "L'évenement est modifié", "success");
            })
            .catch(function (error) {
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
            dispatch(updateAppTitleStyle(res.data.titleEventappStyle));
            emitEvent("update", "title-style", res.data.titleEventappStyle);
            Swal.fire("Modifié!", "L'évenement est modifié", "success");
          })
          .catch((error) => {
            if (error.response.status === 401) {
              localStorage.removeItem("token");
              history.go(0);
            } else {
            }
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
            dispatch(updateAppTitleStyle(res.data.titleEventappStyle));
            emitEvent("update", "title-style", res.data.titleEventappStyle);
            Swal.fire("Modifié!", "L'évenement est modifié", "success");
          })
          .catch(function (error) {
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
  //modifier le display du titre
  const setDisplayTitleAndPush = () => {
    axios
      .put(
        `${FETCH}/app/titleEventappStyle/display/0"`,
        { display: !displayTitle },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        dispatch(updateAppTitleStyle(res.data.titleEventappStyle));
        emitEvent("update", "title-style", res.data.titleEventappStyle);
        Swal.fire("Modifié!", "L'évenement est modifié", "success");
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("token");
          history.go(0);
        } else {
          Swal.fire("Erreur!", "Une erreur est survenue", "error");
        }
      });
  };
  const changeAccesValue = (e: any) => {
    setEventCurrent({
      ...eventCurrent,
      [e.target.name]: !eventCurrent[e.target.name],
    });
  };

  useEffect(() => {
    setPositionTitle(eventSetting.titleEventappStyle.position);
    setDisplayTitle(eventSetting.titleEventappStyle.display);
  }, [eventSetting]);

  useEffect(() => {
    if (event.isLoad) {
      const activeMusic = event.active_music_request;
      const activePicture = event.active_wall_picture;
      setEventCurrent({
        ...event,
        active_music_request: activeMusic,
        active_wall_picture: activePicture,
      });
    }
  }, [event]);

  return (
    <div>
      {!event.isLoad ? <AddNewEvent token={token} refetch={() => {}} /> : null}

      {!event.isLoad ? null : (
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
                          changeAccesValue(e);
                        }}
                        checked={eventCurrent.active_music_request}
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
                          changeAccesValue(e);
                        }}
                        checked={eventCurrent.active_wall_picture}
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
      )}

      {!event.isLoad ? null : (
        <div className="bg-white dark:bg-gray-700 shadow sm:rounded-lg my-2.5">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Modifier Titre
              </h3>
              <Switch
                checked={displayTitle}
                onChange={setDisplayTitleAndPush}
                className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer  dark"
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute  w-full h-full rounded-md"
                />
                <span
                  aria-hidden="true"
                  className={classNames(
                    displayTitle ? "bg-indigo-600" : "bg-gray-200",
                    "pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200"
                  )}
                />
                <span
                  aria-hidden="true"
                  className={classNames(
                    displayTitle ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200"
                  )}
                />
              </Switch>
            </div>

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
                    value={positionTitle}
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
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-200">
              <p>Modifier pour changer la couleur du titre</p>
            </div>
            <div className=" flex items-start">
              <form
                className="space-y-5 mt-4 w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangeColorTitle();
                }}
              >
                <div className=" flex items-start sm:items-end sm:space-x-4  flex-col sm:flex-row w-full">
                  <HexColorPicker
                    color={eventSetting.titleEventappStyle.color}
                    onChange={setColor}
                  />
                  <button
                    type="submit"
                    className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-5  sm:w-auto sm:text-sm"
                  >
                    Modifier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {!event.isLoad ? null : <TextBannerModify />}

      <FooterSettings />

      {!event.isLoad ? null : <Backgroundheader event={event} token={token} />}

      {!event.isLoad ? null : <DeleteEvent />}
    </div>
  );
};

export default EventLayout;
