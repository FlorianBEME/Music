import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import AdminRoutes from "../../router/listRoute/AdminRoutes";
import { FETCH } from "../../FETCH";
import { eventStore } from "../../slicer/eventSlice";

export default function Layout() {
  const history = useHistory();
  const event = useSelector(eventStore);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${FETCH}/login/isuserauth`, {
          headers: {
            "x-access-token": token,
          },
        })
        .then((response) => {
          if (!response.data.auth) {
            localStorage.removeItem("token");
            history.push("login");
          }
        })
        .catch(function (err) {
          console.error(err);
        });
    } else {
      localStorage.removeItem("token");
      history.push("/login");
    }
  }, [history]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <div className="py-5">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Replace with your content */}

            <Switch>
              {AdminRoutes.map((prop: any, key) => {
                if (prop.redirect) {
                  return (
                    <Redirect from={prop.path} to={prop.pathTo} key={key} />
                  );
                } else {
                  return (
                    <Route
                      path={prop.path}
                      component={() => <prop.component event={event} />}
                      key={key}
                    />
                  );
                }
              })}
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
}
