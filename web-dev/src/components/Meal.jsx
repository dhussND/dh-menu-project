import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Parse from 'parse';

const Meal = () => {
  const { diningHall, meal } = useParams();
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      const query = new Parse.Query('Menu');
      query.equalTo('meal', meal);
      const results = await query.find();
      const uniqueStations = [...new Set(results.map(result => result.get('station')))];
      setStations(uniqueStations);
    };

    fetchStations();
  }, [meal]);

  return (
    <div>
      <h1>{meal} at {diningHall}</h1>
      {stations.map((station, index) => (
        <div key={index}>
          <h2>{station}</h2>
          <ul>
            {stations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Meal;