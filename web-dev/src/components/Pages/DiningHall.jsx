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

  // Format the dining hall name
  const formattedDiningHall = diningHall
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{formattedDiningHall} Menu</h1>
      <p>Select a meal to view the menu:</p>
      
      <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {meals.map((meal, index) => (
          <Link 
            key={index} 
            to={`/${diningHall}/${meal}`}
            style={{
              padding: '1rem',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            {meal}
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