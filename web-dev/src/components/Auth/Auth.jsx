// src/components/Auth/Auth.jsx

import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkUser } from "./AuthService";
import "../../styles/theme.css";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (checkUser()) {
      alert("You are already logged in.");
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="auth-landing">
      <div className="auth-container">
        <h1>Welcome to Notre Dame Dining Hall Menus</h1>
        <p>
          Access dining menus for North and South Dining Halls.
          <br />
          Please log in or register to continue.
        </p>

        <div className="auth-buttons">
          <Link to="/auth/register">
            <button className="btn-auth btn-register">Register</button>
          </Link>
          <Link to="/auth/login">
            <button className="btn-auth btn-login">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
