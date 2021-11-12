import { Switch, BrowserRouter as Router, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FETCH } from "./FETCH";
import Home from "./Pages/Home";
import Login from "./Pages/login";
import Layout from "./Pages/admin/layout";
import RouteVisitor from "./router/RouteVisitor";
import RouteLogin from "./router/RoutesLogin";
import RouteAdmin from "./router/RouteAdmin";
import NewUser from "./Pages/NewUser";
import { disconnect } from "./components/common/socket";

function App() {
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

  return (
    <div className="">
      <Router>
        <Switch>
          <Redirect exact path="/" to="/app" />
          <RouteVisitor exact path="/app" component={Home} />
          <RouteVisitor exact path="/new" component={NewUser} />
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
