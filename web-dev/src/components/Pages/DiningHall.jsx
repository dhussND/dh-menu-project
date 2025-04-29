import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Parse from 'parse';
import '../../styles/theme.css';

const DiningHall = () => {
  const { diningHall } = useParams();
  const [meals, setMeals] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  // format dining hall name
  const formattedDiningHall = diningHall
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    const fetchMeals = async () => {
      const today = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = today.toLocaleDateString('en-US', options);
      setCurrentDate(formattedDate);

      const query = new Parse.Query('Menu');
      query.equalTo('date', formattedDate);
      query.equalTo('diningHall', formattedDiningHall);
      const results = await query.find();

      // extract unique meals for the current day
      const uniqueMeals = [...new Set(results.map(result => result.get('meal')))];
      setMeals(uniqueMeals);
    };

    fetchMeals();
  }, [formattedDiningHall]);

  // format the current date
  return (
    <div className="home-container">
      <h1>{formattedDiningHall} Menu</h1>
      <p className="subtext">Today's menu for {currentDate}</p>

      <div className="home-buttons">
        {meals.map((meal, index) => (
          <Link key={index} to={`/${diningHall}/${meal}`}>
            <button className="btn-auth btn-dining">{meal}</button>
          </Link>
        ))}
      </div>

      <Link to="/home">
        <button className="btn-auth btn-secondary btn-dining mt-3">Back to Home</button>
      </Link>
    </div>
  );
};

export default DiningHall;
