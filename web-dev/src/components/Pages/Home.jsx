import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableDiningHalls } from '../../api/menu';
import '../../styles/theme.css';

const Home = () => {
  const [availableDiningHalls, setAvailableDiningHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiningHalls = async () => {
      try {
        const halls = await getAvailableDiningHalls();
        setAvailableDiningHalls(halls);
      } catch (error) {
        console.error('Error fetching dining halls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiningHalls();
  }, []);

  const getDiningHallPath = (diningHall) => {
    return `/${diningHall.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="home-container">
      <h1>University Dining Hall Menu</h1>
      <p>
        Welcome to the university dining hall menu app.
        <br />
        Select a dining hall to view the menu.
      </p>

      <div className="home-buttons">
        {loading ? (
          <p>Loading available dining halls...</p>
        ) : availableDiningHalls.length > 0 ? (
          availableDiningHalls.map((diningHall) => (
            <Link key={diningHall} to={getDiningHallPath(diningHall)}>
              <button className="btn-auth btn-dining">{diningHall}</button>
            </Link>
          ))
        ) : (
          <p>No dining halls available for today.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
