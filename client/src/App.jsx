import { Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { FETCH } from "./FETCH";

import { initAppState } from "./slicer/appSlice";
import { initEventState } from "./slicer/eventSlice";
import { initMusicStore } from "./slicer/musicSlice";

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
    const fetchEvent = () => {
      axios.get(`${FETCH}/events`).then((res) => {
        // si une soirée est en cours
        if (res.data.length > 0) {
          const currentEvent = res.data;
          // On stock l'event dans le store
          dispatch(initEventState({ ...currentEvent[0], isLoad: true }));
        } else {
          dispatch(initEventState({ isLoad: false }));
        }
      });
    };

    const fetchSongs = () => {
      axios
        .get(`${FETCH}/currentSongs`)
        .then((res) => {
          dispatch(initMusicStore(res.data));
        })
        .catch(function (erreur) {
          console.error(erreur);
        });
    };

    const fetchApp = () => {
      axios
        .get(`${FETCH}/app/app`)
        .then((res) => {
          console.log(res.data);
          dispatch(initAppState(res.data));
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const fetchFooter = () => {
      axios
        .get(`${FETCH}/footer`)
        .then((res) => {
          dispatch(initAppState({ itemFooter: res.data }));
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const fetchFooterCopyright = () => {
      axios.get(`${FETCH}/copyright`).then((res) => {
        if (res.data.length > 0) {
          dispatch(initAppState({ footerCopyright: res.data[0].text }));
        } else {
        }
      });
    };

    const fetchSongIncurrent = () => {
      //fetch titre en cours
      axios
        .get(`${FETCH}/app/app`)
        .then((res) => {
        })
        .catch(function (erreur) {
          console.error(erreur);
        });
    };

    const fetchMusicList = () => {
      axios
        .get(`${FETCH}/currentSongs`)
        .then((res) => {
          dispatch(initMusicStore(res.data));
        })
        .catch(function (erreur) {
          console.error(erreur);
        });
    };

    fetchSongIncurrent();
    fetchMusicList();
    fetchApp();
    fetchFooter();
    fetchFooterCopyright();
    fetchSongs();
    fetchEvent();
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
