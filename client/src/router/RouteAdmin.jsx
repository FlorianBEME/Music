import { Switch, Route, Redirect } from "react-router-dom";
import AdminNavBar from "../components/admin/AdminNavBar";
import { Fragment } from "react";

const RouteAdmin = ({ component: Component, isAuth, ...rest }) => {
  return (
    <div>
      <Switch>
        <Route
          {...rest}
          render={(props) => {
            if (isAuth) {
              return (
                <Route
                  {...rest}
                  render={(props) => (
                    <Fragment>
                      <AdminNavBar />
                      <Component {...props} />
                    </Fragment>
                  )}
                />
              );
            } else {
              return (
                <Redirect
                  to={{
                    pathname: "/login",
                    state: {
                      from: props.location,
                    },
                  }}
                />
              );
            }
          }}
        />
      </Switch>
    </div>
  );
};

export default RouteAdmin;
