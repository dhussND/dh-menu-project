import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>University Dining Hall Menu</h1>
      <p>Welcome to the university dining hall menu app. Select a dining hall to view the menu.</p>
      <Link to="/north-dining-hall">North Dining Hall</Link>
      <br />
      <Link to="/south-dining-hall">South Dining Hall</Link>
    </div>
  );
};

export default Home;