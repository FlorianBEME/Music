import { Route, Switch, Redirect } from "react-router-dom";
import AdminRoutes from "../../router/listRoute/AdminRoutes";
import { useEffect, useState } from "react";
import axios from "axios";
import { FETCH } from "../../FETCH";
import { subscribeToSocket } from "../../components/common/socket";

export default function Layout() {
  const [event, setevent] = useState(null);
  //Fecth feature
  const fetchFeature = () => {
    axios
      .get(`${FETCH}/events`)
      .then((res) => {
        setevent(res.data[0]);
      })
      .catch(function (erreur) {
        console.log(erreur);
      });
  };
  useEffect(() => {
    fetchFeature();
  }, []);
  useEffect(() => {
    subscribeToSocket((args) => {
      if (args === "event") {
        fetchFeature();
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <div className="py-5">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Replace with your content */}

            <Switch>
              {AdminRoutes.map((prop, key) => {
                if (prop.redirect) {
                  return (
                    <Redirect from={prop.path} to={prop.pathTo} key={key} />
                  );
                } else {
                  return (
                    <Route
                      test={event}
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
