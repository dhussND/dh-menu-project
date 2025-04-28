// src/components/Navbar.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLogout from './Auth/AuthLogout';
import { checkUser } from './Auth/AuthService';
import '../styles/theme.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(checkUser());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentStatus = checkUser();
      setIsLoggedIn(currentStatus);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="nd-navbar">
      <div className="nd-navbar-logo">
        <Link to="/home" className="nd-nav-link nd-logo-text">
          ND Dining
        </Link>
      </div>

      <div className="nd-navbar-links">
        {isLoggedIn ? (
          <>
            <Link to="/home" className="nd-nav-link">Home</Link>
            <Link to="/north-dining-hall" className="nd-nav-link">North</Link>
            <Link to="/south-dining-hall" className="nd-nav-link">South</Link>
            <AuthLogout onLogout={() => setIsLoggedIn(false)} />
          </>
        ) : (
          <>
            <Link to="/auth/login" className="nd-nav-link">Login</Link>
            <Link to="/auth/register" className="nd-nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
