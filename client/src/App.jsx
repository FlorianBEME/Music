import { Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { FETCH } from "./FETCH";

import { initAppState } from "./slicer/appSlice";
import { initEventState } from "./slicer/eventSlice";
import { initMusicStore } from "./slicer/musicSlice";
import { initPictureStoreAvailable } from "./slicer/photoSlice";

import Home from "./Pages/Home";
import Login from "./Pages/login";
import Layout from "./Pages/admin/layout";
import RouteVisitor from "./router/RouteVisitor";
import RouteLogin from "./router/RoutesLogin";
import RouteAdmin from "./router/RouteAdmin";
import NewUser from "./Pages/NewUser";

import {
  SocketPublicComponent,
  disconnect,
} from "./components/common/socketio/SocketPublicComponent";

function App() {
  const dispatch = useDispatch();
  const [isAuthVerify, setAuth] = useState(false);

  // on vérifie si un l'utilisateur à un token et si ce token proviens bien de notre back
  const verifyToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${FETCH}/login/isuserauth`, {
          headers: {
            "x-access-token": token,
          },
        })
        .then((response) => {
          if (response.data.auth === true) {
            setAuth(true);
          } else {
            localStorage.removeItem("token");
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  };

  useEffect(() => {
    verifyToken();
    return function cleanup() {
      disconnect();
    };
  }, []);

  useEffect(() => {
    let apiDone = [];

    const fetchEvent = async () => {
      await axios.get(`${FETCH}/events`).then((res) => {
        // si une soirée est en cours
        if (res.data.length > 0) {
          const currentEvent = res.data;
          // On stock l'event dans le store
          dispatch(initEventState({ ...currentEvent[0], isLoad: true }));
          apiDone.push("event");
        } else {
          dispatch(initEventState({ isLoad: false }));
        }
      });
    };

    const fetchSongs = async () => {
      await axios
        .get(`${FETCH}/currentSongs`)
        .then((res) => {
          dispatch(initMusicStore(res.data));
          apiDone.push("songs");
        })
        .catch(function (erreur) {
          console.error(erreur);
        });
    };

    const fetchApp = async () => {
      await axios
        .get(`${FETCH}/app/app`)
        .then((res) => {
          dispatch(initAppState(res.data));
          apiDone.push("app");
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const fetchFooter = async () => {
      await axios
        .get(`${FETCH}/footer`)
        .then((res) => {
          dispatch(initAppState({ itemFooter: res.data }));
          apiDone.push("footer");
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const fetchFooterCopyright = async () => {
      await axios.get(`${FETCH}/copyright`).then((res) => {
        if (res.data.length > 0) {
          dispatch(initAppState({ footerCopyright: res.data[0].text }));
          apiDone.push("copyright");
        } else {
        }
      });
    };

    const fetchSongIncurrent = async () => {
      //fetch titre en cours
      await axios
        .get(`${FETCH}/app/app`)
        .then(() => {
          apiDone.push("songsincurrent");
        })
        .catch(function (erreur) {
          console.error(erreur);
        });
    };

    const fetchPicture = async () => {
      await axios
        .get(`${FETCH}/eventpicture`)
        .then((res) => {
          console.log(res.data);
          dispatch(initPictureStoreAvailable(res.data));
          apiDone.push("picture");
        })
        .catch((err) => {
          console.error(err);
        });
    };
    Promise.all([
      fetchPicture(),
      fetchSongIncurrent(),
      fetchApp(),
      fetchFooter(),
      fetchFooterCopyright(),
      fetchSongs(),
      fetchEvent(),
    ]).then(() => {
      // loader
    });
  }, [dispatch]);

  return (
    <div className="">
      <SocketPublicComponent />
      <Router>
        <Switch>
          <RouteVisitor exact path="/" component={Home} />
          <RouteVisitor exact path="/new" component={NewUser} />
          <RouteLogin path="/login" component={Login} isAuth={isAuthVerify} />
          <RouteAdmin
            path="/dashboard"
            component={Layout}
            isAuth={isAuthVerify}
          />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
