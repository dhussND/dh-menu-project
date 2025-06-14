import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkUser, loginAsGuest } from "./AuthService";
import "../../styles/theme.css";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (checkUser()) {
      alert("You are already logged in.");
      navigate("/home");
    }
  }, [navigate]);

  const handleGuestLogin = async () => {
    const guestUser = await loginAsGuest();
    if (guestUser) {
      navigate("/home");
    }
  };

  return (
    <div className="auth-landing">
      <div className="auth-container">
        <h1>Welcome to Notre Dame Dining Hall Menus</h1>
        <p>
          Access dining menus for North and South Dining Halls.
          <br />
          Please log in, register, or continue as guest.
        </p>

        <div className="auth-buttons">
          <Link to="/auth/register">
            <button className="btn-auth btn-register">Register</button>
          </Link>
          <Link to="/auth/login">
            <button className="btn-auth btn-login">Login</button>
          </Link>
          <button 
            onClick={handleGuestLogin}
            className="btn-auth btn-guest"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
