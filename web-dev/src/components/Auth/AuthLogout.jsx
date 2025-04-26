import React from "react";
import { logoutUser } from "./AuthService";
import { useNavigate } from "react-router-dom";
import "../../styles/theme.css";

const AuthLogout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result) {
      if (onLogout) onLogout();
      navigate("/auth");
    }
  };

  return (
    <button onClick={handleLogout} className="btn-auth btn-logout">
      Logout
    </button>
  );
};

export default AuthLogout;
