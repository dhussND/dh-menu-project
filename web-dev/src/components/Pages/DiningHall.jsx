import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Parse from 'parse';

const DiningHall = () => {
  const { diningHall } = useParams();
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      const query = new Parse.Query('Menu');
      const results = await query.find();
      const uniqueMeals = [...new Set(results.map(result => result.get('meal')))];
      setMeals(uniqueMeals);
    };

    fetchMeals();
  }, []);

  // Format the dining hall name
  const formattedDiningHall = diningHall
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div>
      <h1>{formattedDiningHall} Menu</h1>
      <p>Select a meal to view the menu:</p>
      <ul>
        {meals.map((meal, index) => (
          <li key={index}>
            <Link to={`/${diningHall}/${meal}`}>{meal}</Link>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default DiningHall;
