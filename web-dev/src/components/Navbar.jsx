import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLogout from './Auth/AuthLogout';
import { checkUser } from './Auth/AuthService';
import '../App.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(checkUser());

  // Keep checking auth state when route or login status might change
  useEffect(() => {
    const interval = setInterval(() => {
      const currentStatus = checkUser();
      setIsLoggedIn(currentStatus);
    }, 1000); // check every second (can reduce this if needed)

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/home" className="nav-link" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          ND Dining
        </Link>
      </div>

      {isLoggedIn ? (
        <div className="nav-links">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/north-dining-hall" className="nav-link">North</Link>
          <Link to="/south-dining-hall" className="nav-link">South</Link>
          <AuthLogout onLogout={() => setIsLoggedIn(false)} />
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/auth/login" className="nav-link">Login</Link>
          <Link to="/auth/register" className="nav-link">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
