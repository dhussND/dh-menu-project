import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/theme.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>University Dining Hall Menu</h1>
      <p>
        Welcome to the university dining hall menu app.
        <br />
        Select a dining hall to view the menu.
      </p>

      <div className="home-buttons">
        <Link to="/north-dining-hall">
          <button className="btn-auth btn-dining">North Dining Hall</button>
        </Link>
        <Link to="/south-dining-hall">
          <button className="btn-auth btn-dining">South Dining Hall</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
