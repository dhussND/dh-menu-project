import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Parse from 'parse';
import SearchBar from './SearchBar';

const Meal = () => {
  const { diningHall, meal } = useParams();
  const [stations, setStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStations = async () => {
      const query = new Parse.Query('Menu');
      query.equalTo('meal', meal);
      const results = await query.find();

      // Group items by station
      const groupedStations = results.reduce((acc, result) => {
        const station = result.get('station');
        const items = result.get('items');
        if (!acc[station]) {
          acc[station] = [];
        }
        acc[station].push(...items);
        return acc;
      }, {});

      // Convert to an array of stations with their items
      const stationList = Object.keys(groupedStations).map(station => ({
        name: station,
        items: groupedStations[station],
      }));

      setStations(stationList);
    };

    fetchStations();
  }, [meal]);

  // Format the dining hall name
  const formattedDiningHall = diningHall
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Filter stations and items based on the search query
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
    <div>
      <h1>{meal} at {formattedDiningHall}</h1>
      <SearchBar
        placeholder="Search for a food item or station..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredStations.map((station, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <details>
            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>
              {station.name}
            </summary>
            <ul>
              {station.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
};

export default Meal;