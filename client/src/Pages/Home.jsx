import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { FETCH } from "../FETCH";
import { FiLoader } from "react-icons/fi";

import Footer from "../components/footer";
import NavBar from "../components/NavBar";
import MusicBandeau from "../assets/musicbandeau.jpg";

import WallPicture from "../components/WallPicture";
import SongRequestBloc from "../components/songRequestBloc";

const Home = () => {
  const history = useHistory();
  //Verification de la soirée
  const [event, setEvent] = useState([]);
  const [eventLoad, setEventLoad] = useState(false);

  let VisitorRoutes = [
    {
      id: 1,
      path: "/app/music",
      name: "Musique",
      icon: "mdi mdi-pencil-circle",
      redirect: false,
      component: SongRequestBloc,
    },
    {
      id: 2,
      path: "/app/picture",
      name: "Photo",
      icon: "mdi mdi-pencil-circle",
      redirect: false,
      component: WallPicture,
    },
    {
      id: 4,
      path: "/app",
      pathTo: "/app/music",
      name: "App",
      redirect: true,
    },
  ];

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
    });

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
          localStorage.setItem("uuidEvent", currentEvent[0].uuid);
        }
        // on verifie l'uuid du visiteur
        verifyUser
          .then((res) => {
            axios
              .get(`${FETCH}/events`)
              .then((res) => {
                setEvent(res.data);
                setTimeout(function () {
                  setEventLoad(true);
                }, 2000);
              })
              .catch(function (erreur) {
                console.log(erreur);
              });
          })
          .catch((err) => {
            history.push("/new");
          });
        console.log("ya un soirée");
      } else {
        // si pas de soirée en cours on vide le local storage
        localStorage.removeItem("idMusicVoting");
        localStorage.removeItem("usInfoMusic");
        localStorage.removeItem("uuidEvent");
        setEventLoad(true);
      }
    });
  }, [history]);

  return (
    <div>
      {eventLoad ? (
        event.length > 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 min-h-screen flex flex-col justify-between">
            <div>
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
                  <div className="flex items-center justify-center h-full">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl ">
                      {event[0].name}
                    </h1>
                  </div>
                </div>
              </div>
              <NavBar event={event} />
            </div>

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
              {/* Replace with your content */}

              <Switch>
                {/* <Route path="/app/music" component={SongRequest} /> */}
                {VisitorRoutes.map((prop, key) => {
                  if (prop.redirect) {
                    return (
                      <Redirect from={prop.path} to={prop.pathTo} key={key} />
                    );
                  } else {
                    return (
                      <Route
                        path={prop.path}
                        component={prop.component}
                        key={key}
                      />
                    );
                  }
                })}
              </Switch>
            </div>

            <Footer />
          </div>
        ) : (
          // <SongRequest event={event} eventLoad={eventLoad} />
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
