import React from "react";
import { logoutUser } from "./AuthService";
import { useNavigate } from "react-router-dom";

const AuthLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result) {
      navigate("/auth"); // Send user back to login
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default AuthLogout;