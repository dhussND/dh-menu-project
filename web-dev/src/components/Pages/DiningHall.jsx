import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Parse from 'parse';
import '../../App.css';

const DiningHall = () => {
  const { diningHall } = useParams();
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      const query = new Parse.Query('Menu');
      const results = await query.find();
      const uniqueMeals = [...new Set(results.map(result => result.get('meal')))];
      setMeals(uniqueMeals);
    };

    fetchMeals();
  }, []);

  const formattedDiningHall = diningHall
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="home-container">
      <h1>{formattedDiningHall} Menu</h1>
      <p>Select a meal to view the menu:</p>

      <div className="home-buttons">
        {meals.map((meal, index) => (
          <Link 
            key={index} 
            to={`/${diningHall}/${meal}`}
          >
            <button className="dining-hall-button">{meal}</button>
          </Link>
        ))}
      </div>

      <Link to="/home">
        <button style={{ marginTop: '1rem' }}>Back to Home</button>
      </Link>
    </div>
  );
};

export default DiningHall;