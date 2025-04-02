import React from "react";
import { checkUser } from "../Auth/AuthService";
import { Navigate } from "react-router-dom";

// Updated to work with React Router v6
const ProtectedRoute = ({ element: Component, ...rest }) => {
  if (checkUser()) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/auth" replace />;
  }
};

export default ProtectedRoute;