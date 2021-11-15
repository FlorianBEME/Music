import { Route, Switch, Redirect } from "react-router-dom";
import AdminRoutes from "../../router/listRoute/AdminRoutes";
import { useEffect, useState } from "react";
import axios from "axios";
import { FETCH } from "../../FETCH";
import { subscribeToSocket } from "../../components/common/socket";
import { useHistory } from "react-router-dom";

export default function Layout() {
  const history = useHistory();
  const [event, setevent] = useState(null);
  const [dataLoad, setDataLoad] = useState(true);

  //Fecth event et
  const fetchEvent = () => {
    axios
      .get(`${FETCH}/events`)
      .then((res) => {
        setevent(res.data);
        setDataLoad(true);
      })
      .catch(function (err) {
        console.error(err);
      });
  };
  useEffect(() => {
    fetchEvent();
  }, []);

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

  useEffect(() => {
    subscribeToSocket((args: string) => {
      if (args === "event") {
        console.log("je recoit");
        fetchEvent();
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
                          refetch={() => {
                            fetchEvent();
                          }}
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
