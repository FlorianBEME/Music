import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { FETCH } from "../FETCH";
import { FiLoader } from "react-icons/fi";
import Footer from "../components/visitor/footer";
import NavBar from "../components/visitor/NavBar";
import MusicBandeau from "../assets/musicbandeau.jpg";
import WallPicture from "../components/visitor/WallPicture";
import SongRequestBloc from "../components/visitor/songRequestBloc/songRequestBloc";

import { subscribeToSocket } from "../components/common/socket";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Home = () => {
  const history = useHistory();
  const [event, setEvent] = useState([]);
  const [eventLoad, setEventLoad] = useState(false);
  const [component, setComponent] = useState();
  const [positionTitle, setPositionTitle] = useState("center");
  const [color, setColor] = useState("#ffffff");
  const [pop, setPop] = useState([]);

  const componentRender = () => {
    if (component === "music") {
      return <SongRequestBloc />;
    } else if (component === "picture") {
      return <WallPicture />;
    }
  };
  const changeComponent = (component) => {
    setComponent(component);
  };
  const fetchTitleStyle = () => {
    axios
      .get(`${FETCH}/app/app`)
      .then((res) => {
        setPositionTitle(res.data.titleEventappStyle.position);
        setColor(res.data.titleEventappStyle.color);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchPopUp = () => {
    axios
      .get(`${FETCH}/pop/available`)
      .then((res) => {
        console.log(res.data);
        setPop(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchPopUp();
  }, []);

  useEffect(() => {
    fetchTitleStyle();
  }, []);

  useEffect(() => {
    // Verification du visiteur
    const verifyUser = new Promise((resolve, reject) => {
      // si un visiteur n'est pas nouveau
      if (localStorage.getItem("usInfoMusic")) {
        const usInfo = JSON.parse(localStorage.getItem("usInfoMusic"));
        // on verifie que celui-ci figure bien dans la BDD
        axios
          .post(`${FETCH}/visitor/${usInfo.id}`, { uuid: usInfo.uuid })
          .then((res) => {
            if (!res.data.status) {
              // On vide son local storage
              localStorage.removeItem("usInfoMusic");
              reject();
            } else {
              resolve();
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      } else {
        reject();
      }
    }, []);

    const uuidEvent = localStorage.getItem("uuidEvent");
    // on fetch la soirée en cours
    axios.get(`${FETCH}/events`).then((res) => {
      // si une soirée est en cours
      if (res.data.length > 0) {
        const currentEvent = res.data;
        setEvent(currentEvent);
        // on verifie le local storage
        if (currentEvent[0].uuid !== uuidEvent || !uuidEvent) {
          localStorage.removeItem("idMusicVoting");
          localStorage.removeItem("usInfoMusic");
          localStorage.removeItem("popid");
          localStorage.setItem("uuidEvent", currentEvent[0].uuid);
        }
        // on verifie l'uuid du visiteur
        verifyUser
          .then((res) => {
            axios
              .get(`${FETCH}/events`)
              .then((res) => {
                setEvent(res.data);
                // fonction pour le loader
                setTimeout(function () {
                  setEventLoad(true);
                }, 2000);
              })
              .catch(function (erreur) {
                console.log(erreur);
              });
          })
          .catch((err) => {
            // si erreur on renvoie vers la page nouvel utilisateur
            history.push("/new");
          });
      } else {
        // si pas de soirée en cours on vide le local storage
        localStorage.removeItem("idMusicVoting");
        localStorage.removeItem("usInfoMusic");
        localStorage.removeItem("uuidEvent");
        localStorage.removeItem("popid");
        setEventLoad(true);
      }
    });
  }, [history]);

  useEffect(() => {
    if (eventLoad && event.length > 0) {
      if (event[0].active_music_request) {
        changeComponent("music");
      } else if (
        !event[0].active_music_request &&
        event[0].active_wall_picture
      ) {
        changeComponent("picture");
      }
    }
  }, [event, eventLoad]);

  useEffect(() => {
    subscribeToSocket((args) => {
      if (args === "event") {
        history.go(0);
      } else if (args === "settitle") {
        fetchTitleStyle();
      } else if (args === "pop") {
        fetchPopUp();
      }
    });
  }, [history]);

  useEffect(() => {
    let popinLocalStorage = [];
    let popId = localStorage.getItem("popid");
    if (popId) {
      let arr = popId.split(",");
      arr.forEach((item) => {
        popinLocalStorage.push(parseInt(item));
      });
    }
    async function verifyPopAndDisplay() {
      for (const item of pop) {
        // on vérifie que le pop up n'as as deja était vu et traité
        if (!popinLocalStorage.includes(item.id)) {
          if (!item.filePath) {
            await Swal.fire({
              title: item.title,
              text: item.text_content,
              confirmButtonText: "Ok! ",
            }).then((result) => {
              if (result.isConfirmed) {
                popinLocalStorage.push(item.id);
                localStorage.setItem("popid", popinLocalStorage.toString());
              }
            });
          } else {
            await Swal.fire({
              title: item.title,
              text: item.text_content,
              confirmButtonText: "Ok!",
              imageUrl: item.filePath,
              imageWidth: 400,
              imageHeight: 200,
              imageAlt: item.title,
            }).then((result) => {
              if (result.isConfirmed) {
                popinLocalStorage.push(item.id);
                localStorage.setItem("popid", popinLocalStorage.toString());
              }
            });
          }
        }
      }
    }
    // on met un timer
    setTimeout(() => {
      if (pop.length >= 1) {
        verifyPopAndDisplay();
      }
    }, 8000);
  }, [pop]);

  return (
    <div>
      {eventLoad ? (
        event.length > 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 min-h-screen flex flex-col justify-between">
            <div className="flex flex-col">
              <div className="relative h-32">
                <div className="absolute inset-0">
                  {eventLoad ? (
                    <img
                      className="w-full h-full object-cover"
                      src={
                        event.length > 0 && event[0].bg_music !== null
                          ? `/uploads/${event[0].bg_music}`
                          : MusicBandeau
                      }
                      alt="banniere"
                    />
                  ) : null}
                </div>
                <div className="relative max-w-7xl mx-auto h-32 sm:px-8 px-2">
                  <div
                    className={classNames(
                      positionTitle === "center"
                        ? "justify-center"
                        : positionTitle === "left"
                        ? "justify-start"
                        : "justify-end",
                      "flex items-center h-full"
                    )}
                  >
                    <h1
                      className="text-4xl font-extrabold tracking-tight sm:text-5xl "
                      style={{ color: color }}
                    >
                      {event[0].name}
                    </h1>
                  </div>
                </div>
              </div>
              <NavBar event={event} changeComponent={changeComponent} />
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
                {componentRender()}
              </div>
            </div>

            <Footer />
          </div>
        ) : (
          <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
              <div className="text-center">
                {/*<h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Request*/}
                {/*    Songs</h2>*/}
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                  Request Songs
                </p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                  Veuillez vous connecter afin de creer un évenement!
                </p>
                <Link to="/login">
                  <div className="inline-flex rounded-md shadow">
                    <div className="mt-4 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      Login
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="w-full h-screen justify-center items-center flex flex-col">
          <FiLoader size={42} className="animate-spin" />
          <h2 className="animate-pulse">Chargement</h2>
        </div>
      )}
    </div>
  );
};

export default Home;
