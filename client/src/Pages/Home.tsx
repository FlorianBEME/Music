import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
// import Swal from "sweetalert2";
import { FiLoader } from "react-icons/fi";

import Footer from "../components/visitor/footer";
import NavBar from "../components/visitor/NavBar";
import WallPicture from "../components/visitor/layouts/WallPicture";
import SongRequestBloc from "../components/visitor/layouts/songRequestBloc";
import { Announcement } from "../components/visitor/layouts/Announcement";
import MusicBandeau from "../assets/musicbandeau.jpg";
import { FETCH } from "../FETCH";
import { appParam } from "../slicer/appSlice";

import { TextScrollingBanner } from "../components/visitor/textScrollingBanner";
import { eventStore } from "../slicer/eventSlice";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

// const textBanner =
//   "Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. ";

const Home = () => {
  const appData = useSelector(appParam);
  const eventData = useSelector(eventStore);
  const history = useHistory();

  const [eventLoad, setEventLoad] = useState(false);
  const [component, setComponent] = useState();
  // const [pop, setPop] = useState([]);

  const componentRender = () => {
    if (component === "music") {
      return <SongRequestBloc />;
    } else if (component === "picture") {
      return <WallPicture />;
    } else if (component === "announcement") {
      return <Announcement />;
    }
  };
  const changeComponent = (component: any) => {
    setComponent(component);
  };

  // const fetchPopUp = () => {
  //   axios
  //     .get(`${FETCH}/pop/available`)
  //     .then((res) => {
  //       setPop(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };

  // useEffect(() => {
  //   fetchPopUp();
  // }, []);

  useEffect(() => {
    const userInLocalStorage: any = localStorage.getItem("usInfoMusic");
    const usInfoMusic: any = userInLocalStorage
      ? JSON.parse(userInLocalStorage)
      : null;

    if (eventData.isLoad) {
      // On vérifie si le user est déja venu
      if (!usInfoMusic) {
        localStorage.removeItem("idMusicVoting");
        localStorage.removeItem("popid");
        history.push("/new");
      } else {
        axios
          .post(`${FETCH}/visitor/verify/${usInfoMusic.id}`, {
            uuid: usInfoMusic.uuid,
          })
          .then(() => {
            axios
              .get(`${FETCH}/visitor/${usInfoMusic.id}`)
              .then((res) => {
                //  on ajoute les info user dans le store
              })
              .catch(function (erreur) {
                console.error(erreur);
              });
          })
          .catch((err) => {
            if (err.response.status === 404) {
              localStorage.removeItem("usInfoMusic");
              localStorage.removeItem("idMusicVoting");
              localStorage.removeItem("popid");
              history.push("/new");
            }
          });
      }
    }
    return () => {};
  }, [eventData, history]);

  useEffect(() => {
    if (eventLoad && eventData.isLoad) {
      if (eventData.active_music_request) {
        changeComponent("music");
      } else if (
        !eventData.active_music_request &&
        eventData.active_wall_picture
      ) {
        changeComponent("picture");
      }
    }
  }, [eventData, eventLoad]);

  useEffect(() => {
    if (eventData.hasOwnProperty("isLoad")) {
      setTimeout(() => {
        setEventLoad(true);
      }, 3000);
    }
    return () => {
      setEventLoad(false);
    };
  }, [eventData]);

  // useEffect(() => {
  //   let popinLocalStorage: number[] = [];
  //   let popId = localStorage.getItem("popid");
  //   if (popId) {
  //     let arr = popId.split(",");
  //     arr.forEach((item) => {
  //       popinLocalStorage.push(parseInt(item));
  //     });
  //   }
  //   async function verifyPopAndDisplay() {
  //     for (const item of pop) {
  //       const popup: any = item;
  //       // on vérifie que le pop up n'as as deja était vu et traité
  //       if (!popinLocalStorage.includes(popup.id)) {
  //         if (!popup.filePath) {
  //           await Swal.fire({
  //             title: popup.title,
  //             text: popup.text_content,
  //             confirmButtonText: "Ok! ",
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               popinLocalStorage.push(popup.id);
  //               localStorage.setItem("popid", popinLocalStorage.toString());
  //             }
  //           });
  //         } else {
  //           await Swal.fire({
  //             title: popup.title,
  //             text: popup.text_content,
  //             confirmButtonText: "Ok!",
  //             imageUrl: popup.filePath,
  //             imageAlt: popup.title,
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               popinLocalStorage.push(popup.id);
  //               localStorage.setItem("popid", popinLocalStorage.toString());
  //             }
  //           });
  //         }
  //       }
  //     }
  //   }
  //   // on met un timer
  //   setTimeout(() => {
  //     if (pop.length >= 1) {
  //       verifyPopAndDisplay();
  //     }
  //   }, 8000);
  // }, [pop]);

  return (
    <div>
      {eventLoad ? (
        eventData.isLoad ? (
          <div className="bg-gray-50 dark:bg-gray-800 min-h-screen flex flex-col justify-between">
            <div className="flex flex-col">
              <div className="relative h-32">
                <div className="absolute inset-0">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      eventData.isLoad && eventData.bg_music !== null
                        ? `/uploads/${eventData.bg_music}`
                        : MusicBandeau
                    }
                    alt="banniere"
                  />
                </div>
                {appData.titleEventappStyle.display ? (
                  <div className="relative max-w-7xl mx-auto h-32 sm:px-8 px-2">
                    <div
                      className={classNames(
                        appData.titleEventappStyle.position === "center"
                          ? "justify-center"
                          : appData.titleEventappStyle.position === "left"
                          ? "justify-start"
                          : "justify-end",
                        "flex items-center h-full"
                      )}
                    >
                      <h1
                        className="text-4xl font-extrabold tracking-tight sm:text-5xl "
                        style={{ color: appData.titleEventappStyle.color }}
                      >
                        {eventData.name}
                      </h1>
                    </div>
                  </div>
                ) : null}
              </div>
              <NavBar
                textBanner={appData.app.textbanner}
                active_wall_picture={eventData.active_wall_picture}
                active_music_request={eventData.active_music_request}
                changeComponent={changeComponent}
              />
              {appData.app.textbanner ? (
                <div className="hidden  md:inline-block -mt-4 pb-4">
                  <TextScrollingBanner text={appData.app.textbanner} />
                </div>
              ) : null}

              <div className="max-w-7xl w-full mx-auto sm:px-6 lg:px-8 ">
                {componentRender()}
              </div>
            </div>

            <Footer
              footerItem={appData.itemFooter}
              footerCopyright={appData.footerCopyright}
            />
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
                  <div className="inline-flex rounded-md">
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
