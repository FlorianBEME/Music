import { Switch, BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FETCH } from "./FETCH";
import Home from "./Pages/Home";
import Login from "./Pages/login";
import Layout from "./Pages/admin/layout";
import RouteVisitor from "./router/RouteVisitor";
import RouteLogin from "./router/RoutesLogin";
import RouteAdmin from "./router/RouteAdmin";
import WallPicture from "./Pages/WallPicture.jsx";
import NewUser from "./Pages/NewUser";
import { uuid } from "uuidv4";

function App() {
  const [isAuthVerify, setAuth] = useState(false);

  // on vérifie si un l'utilisateur à un token et si ce token proviens bien de notre back
  const verifyToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("il y a un token");
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
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log("il ny a pas de token");
    }
  };

  // on verifie si l'evenement en cours correspond a celui de notre serveur
  const verifyEvent = () => {
    const nameEvent = localStorage.getItem("nameEvent");
    let newEvent;
    axios
      .get(`${FETCH}/events`)
      .then((response) => {
        let result = response.data.filter((res) => res.type === "name");
        newEvent = result[0].text;
        if (nameEvent) {
          if (newEvent !== nameEvent) {
            localStorage.removeItem("idMusicVoting");
            localStorage.setItem("nameEvent", newEvent);
          }
        } else {
          localStorage.setItem("nameEvent", newEvent);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // on verifie si l'utilisateur est nouveau

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    verifyEvent();
  }, []);

  useEffect(() => {
    verifyUuidUser();
  }, []);

  const userInfo = localStorage.getItem("usInfoMusic");
  const verifyUuidUser = () => {
    if (!userInfo) {
      console.log("nouveau");
      //soit l'utilisateur est nouveau
    } else {
      console.log("ancien");
      // soit il existe déja
    }
  };

  return (
    <div className="">
      <Router>
        <Switch>
          <RouteVisitor exact path="/" component={Home} />
          <RouteVisitor exact path="/new" component={NewUser} />
          <RouteVisitor path="/wallpicture" component={WallPicture} />
          <RouteLogin path="/login" component={Login} isAuth={isAuthVerify} />
          <RouteAdmin
            path="/dashboard"
            component={Layout}
            isAuth={isAuthVerify}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
