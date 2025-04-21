import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Parse from 'parse';
import '../../App.css';

const DiningHall = () => {
  const { diningHall } = useParams();
  const [meals, setMeals] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  const formattedDiningHall = diningHall
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    const fetchMeals = async () => {
      // Format today's date in "Monday, April 21, 2025" format to match the database
      const today = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = today.toLocaleDateString('en-US', options);
      setCurrentDate(formattedDate);

      const query = new Parse.Query('Menu');
      query.equalTo('date', formattedDate);
      query.equalTo('diningHall', formattedDiningHall);
      const results = await query.find();
      
      // Extract unique meals for today's date
      const uniqueMeals = [...new Set(results.map(result => result.get('meal')))];
      setMeals(uniqueMeals);
    };

    fetchMeals();
  }, [formattedDiningHall]);

  return (
    <div className="home-container">
      <h1>{formattedDiningHall} Menu</h1>
      <p>Today's menu for {currentDate}:</p>

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