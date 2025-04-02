import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLogout from './Auth/AuthLogout';
import { checkUser } from './Auth/AuthService';

const Navbar = () => {
  const isLoggedIn = checkUser();
  
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#1a1a1a',
      marginBottom: '2rem',
      borderRadius: '0 0 8px 8px',
    }}>
      <div className="logo">
        <Link to="/home" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          ND Dining
        </Link>
      </div>
      
      {isLoggedIn && (
        <div className="nav-links" style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/home">Home</Link>
          <Link to="/north-dining-hall">North</Link>
          <Link to="/south-dining-hall">South</Link>
          <AuthLogout />
        </div>
      )}
      
      {!isLoggedIn && (
        <div className="nav-links" style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/auth/login">Login</Link>
          <Link to="/auth/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;