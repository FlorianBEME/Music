import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FETCH } from "../FETCH";
import { FiLoader } from "react-icons/fi";
import SongRequest from "../components/SongRequest";
import { useHistory } from "react-router-dom";

const Home = () => {
  //Verification de la soirée
  const [event, setEvent] = useState();
  const [eventLoad, setEventLoad] = useState(false);
  let history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("usInfoMusic")) {
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
    } else {
      history.push("/new");
    }
  }, []);

  return (
    <div>
      {eventLoad ? (
        event.length > 0 ? (
          <SongRequest />
        ) : (
          <div className="bg-white ">
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
