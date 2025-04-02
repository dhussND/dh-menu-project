import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h1>University Dining Hall Menu</h1>
      <p>Welcome to the university dining hall menu app. Select a dining hall to view the menu.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '2rem 0' }}>
        <Link 
          to="/north-dining-hall"
          style={{
            padding: '1.5rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            fontSize: '1.2rem'
          }}
        >
          North Dining Hall
        </Link>
        
        <Link 
          to="/south-dining-hall"
          style={{
            padding: '1.5rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            fontSize: '1.2rem'
          }}
        >
          South Dining Hall
        </Link>
      </div>
    </div>
  );
};

export default Home;