import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import AdminRoutes from "../../router/listRoute/AdminRoutes";
import { FETCH } from "../../FETCH";
import { eventStore } from "../../slicer/eventSlice";
import { appParam } from "../../slicer/appSlice";

export default function Layout() {
  const history = useHistory();
  const event = useSelector(eventStore);
  const eventSetting = useSelector(appParam);

  const [dataLoad, setDataLoad] = useState(true);
  // const [eventSetting, setEventSetting] = useState({});

  //fetch style du titre
  // const fetchEventSetting = () => {
  //   axios
  //     .get(`${FETCH}/app/app`)
  //     .then((res) => {
  //       setEventSetting(res.data);
  //     })
  //     .catch(function (erreur) {
  //       console.error(erreur);
  //     });
  // };

  // useEffect(() => {
  //   fetchEventSetting();
  // }, [event]);

  // //Fecth event info
  // const fetchEvent = () => {
  //   axios
  //     .get(`${FETCH}/events`)
  //     .then((res) => {
  //       // setevent(res.data);
  //       setDataLoad(true);
  //     })
  //     .catch(function (err) {
  //       console.error(err);
  //     });
  // };
  // useEffect(() => {
  //   fetchEvent();
  // }, []);

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
                      component={() => (
                        <prop.component
                          event={event}
                          dataLoad={dataLoad}
                          refetchEvent={() => {}}
                        />
                      )}
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
