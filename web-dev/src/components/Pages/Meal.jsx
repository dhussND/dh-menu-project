import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Parse from 'parse';
import SearchBar from '../SearchBar';
import '../../styles/theme.css';
import MenuItemReview from '../Review/MenuItemReview';

const getItemName = (item) => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return (
    item.name ||
    item.text ||
    item.menu_item_name ||
    item.food?.name ||
    'Unknown Item'
  );
};

const getNutrition = (item) => {
  if (!item || typeof item === 'string') {
    return { nutrients: [], allergens: [], labels: [], calories: null };
  }

  const nutrients = Array.isArray(item.nutrients) ? item.nutrients : [];
  const allergens = Array.isArray(item.allergens) ? item.allergens : [];
  const labels = Array.isArray(item.labels) ? item.labels : [];
  const calorieEntry = nutrients.find((n) =>
    (n?.name || '').toLowerCase().includes('calories') ||
    (n?.name || '').toLowerCase().includes('energy')
  );

  return {
    nutrients,
    allergens,
    labels,
    calories: calorieEntry?.value ?? null,
  };
};

const formatNutrient = (nutrient) => {
  if (!nutrient || !nutrient.name) return null;
  if (nutrient.value === null || nutrient.value === undefined || nutrient.value === '') {
    return nutrient.name;
  }
  return `${nutrient.name}: ${nutrient.value}${nutrient.uom ? ` ${nutrient.uom}` : ''}`;
};

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
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = today.toLocaleDateString('en-US', options);
      setCurrentDate(formattedDate);

      const query = new Parse.Query('Menu');
      query.equalTo('meal', meal);
      query.equalTo('date', formattedDate);
      query.equalTo('diningHall', formattedDiningHall);
      const results = await query.find();

      // group menu items by station
      const groupedStations = results.reduce((acc, result) => {
        const station = result.get('station');
        const items = result.get('items');
        if (!acc[station]) acc[station] = [];
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

  // filter stations based on the search query
  const filteredStations = stations
    .map(station => ({
      ...station,
      items: station.items.filter(item => {
        const name = getItemName(item).toLowerCase();
        return (
          name.includes(searchQuery.toLowerCase()) ||
          station.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }),
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
              {station.items.map((item, idx) => {
                const itemName = getItemName(item);
                const nutrition = getNutrition(item);
                return (
                <li key={idx} className="menu-item">
                  <strong>{itemName}</strong>
                  {(nutrition.calories || nutrition.allergens.length > 0 || nutrition.labels.length > 0) && (
                    <div className="menu-item-meta">
                      {nutrition.calories && (
                        <span className="menu-item-pill">Calories: {nutrition.calories}</span>
                      )}
                      {nutrition.allergens.length > 0 && (
                        <span className="menu-item-pill">Allergens: {nutrition.allergens.join(', ')}</span>
                      )}
                      {nutrition.labels.length > 0 && (
                        <span className="menu-item-pill">Labels: {nutrition.labels.join(', ')}</span>
                      )}
                    </div>
                  )}
                  {nutrition.nutrients.length > 0 && (
                    <details className="nutrition-details">
                      <summary>Nutrition details</summary>
                      <ul className="nutrition-list">
                        {nutrition.nutrients
                          .map(formatNutrient)
                          .filter(Boolean)
                          .map((line, nutrientIndex) => (
                            <li key={nutrientIndex}>{line}</li>
                          ))}
                      </ul>
                    </details>
                  )}
                  <MenuItemReview
                    foodItem={itemName}
                    station={station.name}
                    diningHall={formattedDiningHall}
                  />
                </li>
                );
              })}
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
