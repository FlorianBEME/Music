import React, { Fragment } from "react";
import "../App.css";
import { Route } from "react-router-dom";
import Footer from "../components/footer";

const RouteVisitor = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <Fragment>
          <Component {...props} />
        </Fragment>
      )}
    />
  );
};

export default RouteVisitor;
