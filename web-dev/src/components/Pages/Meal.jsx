import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Parse from 'parse';
import SearchBar from '../SearchBar';
import '../../styles/theme.css';
import MenuItemReview from '../Review/MenuItemReview';

const Meal = () => {
  // get the dining hall and meal from the URL parameters
  const { diningHall, meal } = useParams();
  const [stations, setStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const formattedDiningHall = diningHall
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // fetch the menu items when the component mounts or when the meal/dining hall changes
  useEffect(() => {
    const fetchStations = async () => {
      const today = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/New_York',
      };
      const formattedDate = today.toLocaleDateString('en-US', options);
      setCurrentDate(formattedDate);

      const query = new Parse.Query('Menu');
      query.equalTo('meal', meal);
      query.equalTo('date', formattedDate);
      query.equalTo('diningHall', formattedDiningHall);
      query.limit(1000);
      const results = await query.find();

      // group menu items by station. Each record now represents a single item
      const groupedStations = results.reduce((acc, result) => {
        const station = result.get('station');
        const item = {
          name: result.get('item'),
          calories: result.get('calories'),
          total_fat: result.get('total_fat'),
          saturated_fat: result.get('saturated_fat'),
          cholesterol: result.get('cholesterol'),
          sodium: result.get('sodium'),
          potassium: result.get('potassium'),
          carbohydrates: result.get('carbohydrates'),
          fiber: result.get('fiber'),
          sugars: result.get('sugars'),
          protein: result.get('protein'),
          calcium: result.get('calcium'),
          iron: result.get('iron'),
        };
        if (!acc[station]) acc[station] = [];
        acc[station].push(item);
        return acc;
      }, {});

      const stationList = Object.keys(groupedStations).map((station) => ({
        name: station,
        items: groupedStations[station],
      }));

      setStations(stationList);
    };

    fetchStations();
  }, [meal, diningHall, formattedDiningHall]);

  // filter stations based on the search query
  const filteredStations = stations
    .map((station) => ({
      ...station,
      items: station.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(station => station.items.length > 0);

  return (
    <div className="menu-page">
      <h1>{meal} at {formattedDiningHall}</h1>
      <p className="subtext">Menu for {currentDate}</p>

      <SearchBar
        className="nd-search"
        placeholder="Search for a food item or station..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredStations.length > 0 ? (
        filteredStations.map((station, index) => (
          <details key={index} className="menu-section">
            <summary>{station.name}</summary>
            <ul className="menu-list">
              {station.items.map((item, idx) => (
                <li key={idx} className="menu-item">
                  <strong>{item.name}</strong>
                  <div className="nutrition-info">
                    Calories: {item.calories} | Total Fat: {item.total_fat} | Saturated Fat: {item.saturated_fat} | Cholesterol: {item.cholesterol} | Sodium: {item.sodium} | Potassium: {item.potassium} | Carbs: {item.carbohydrates} | Fiber: {item.fiber} | Sugars: {item.sugars} | Protein: {item.protein} | Calcium: {item.calcium} | Iron: {item.iron}
                  </div>
                  <MenuItemReview
                    foodItem={item.name}
                    station={station.name}
                    diningHall={formattedDiningHall}
                  />
                </li>
              ))}
            </ul>
          </details>
        ))
      ) : (
        <p>No menu items available for today.</p>
      )}

      <div className="menu-nav-buttons">
        <Link to={`/${diningHall}`}>
          <button className="btn-auth btn-secondary btn-dining">Back to {formattedDiningHall}</button>
        </Link>
        <Link to="/home">
          <button className="btn-auth btn-secondary btn-dining">Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default Meal;
