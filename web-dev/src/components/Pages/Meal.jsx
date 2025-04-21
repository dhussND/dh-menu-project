import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Parse from 'parse';
import SearchBar from '../SearchBar';
import '../../App.css';

const Meal = () => {
  const { diningHall, meal } = useParams();
  const [stations, setStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const formattedDiningHall = diningHall
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    const fetchStations = async () => {
      // Format today's date in "Monday, April 21, 2025" format to match the database
      const today = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = today.toLocaleDateString('en-US', options);
      setCurrentDate(formattedDate);

      const query = new Parse.Query('Menu');
      query.equalTo('meal', meal);
      query.equalTo('date', formattedDate);
      query.equalTo('diningHall', formattedDiningHall);
      const results = await query.find();

      const groupedStations = results.reduce((acc, result) => {
        const station = result.get('station');
        const items = result.get('items');
        if (!acc[station]) {
          acc[station] = [];
        }
        acc[station].push(...items);
        return acc;
      }, {});

      const stationList = Object.keys(groupedStations).map(station => ({
        name: station,
        items: groupedStations[station],
      }));

      setStations(stationList);
    };

    fetchStations();
  }, [meal, diningHall, formattedDiningHall]);

  const filteredStations = stations
    .map(station => ({
      ...station,
      items: station.items.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(station => station.items.length > 0);

  return (
    <div className="menu-page">
      <h1>{meal} at {formattedDiningHall}</h1>
      <p>Menu for {currentDate}</p>
      <SearchBar
        className="search-bar"
        placeholder="Search for a food item or station..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredStations.length > 0 ? (
        filteredStations.map((station, index) => (
          <details key={index} className="menu-section">
            <summary>{station.name}</summary>
            <ul>
              {station.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </details>
        ))
      ) : (
        <p>No menu items available for today.</p>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to={`/${diningHall}`}>
          <button>Back to {formattedDiningHall}</button>
        </Link>
        <Link to="/home">
          <button>Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default Meal;