import React from "react";
import { checkUser } from "../Auth/AuthService";
import AuthModule from "../Auth/Auth.jsx";
import { Route } from "react-router-dom";

// You can pass props using the spread operator to throw them on an object if there are too many to break out
const ProtectedRoute = ({ element: Component, ...rest }) => {
    if (checkUser()) {
      return <Component {...rest} />;
    } else {
      return <Route path="/auth" element={<AuthModule />} />
    }
  };
  
  export default ProtectedRoute;
