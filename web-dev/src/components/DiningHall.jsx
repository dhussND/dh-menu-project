import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Parse from 'parse';

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

  return (
    <div>
      <h1>{diningHall} Menu</h1>
      <p>Select a meal to view the menu:</p>
      {meals.map((meal, index) => (
        <Link key={index} to={`/${diningHall}/${meal}`}>
          {meal}
        </Link>
      ))}
    </div>
  );
};

export default DiningHall;