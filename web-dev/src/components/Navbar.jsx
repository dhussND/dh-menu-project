import React from 'react';
import { Link } from 'react-router-dom';
import AuthLogout from './Auth/AuthLogout';
import { checkUser } from './Auth/AuthService';
import '../App.css';

const Navbar = () => {
  const isLoggedIn = checkUser();

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
          <AuthLogout />
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
