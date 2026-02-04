import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import Parse from 'parse';
import '../../styles/theme.css';

const DATE_OPTIONS = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const toIsoDate = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const formatDisplayDate = (isoDate) => {
  const date = isoDate ? new Date(`${isoDate}T12:00:00`) : new Date();
  return date.toLocaleDateString('en-US', DATE_OPTIONS);
};

const DiningHall = () => {
  const { diningHall } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [meals, setMeals] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // format dining hall name
  const formattedDiningHall = diningHall
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    const paramDate = searchParams.get('date');
    const initialDate = paramDate || toIsoDate(new Date());
    setSelectedDate(initialDate);
  }, [searchParams]);

  const formattedDate = useMemo(
    () => formatDisplayDate(selectedDate),
    [selectedDate]
  );

  useEffect(() => {
    const fetchMeals = async () => {
      if (!selectedDate) return;
      setCurrentDate(formattedDate);

      const query = new Parse.Query('Menu');
      query.equalTo('date', formattedDate);
      query.equalTo('diningHall', formattedDiningHall);
      const results = await query.find();

      // extract unique meals for the selected day
      const uniqueMeals = [...new Set(results.map(result => result.get('meal')))];
      const mealOrder = ['breakfast', 'brunch', 'lunch', 'dinner'];
      uniqueMeals.sort((a, b) => {
        const aIndex = mealOrder.indexOf(String(a).toLowerCase());
        const bIndex = mealOrder.indexOf(String(b).toLowerCase());
        if (aIndex === -1 && bIndex === -1) {
          return String(a).localeCompare(String(b));
        }
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
      setMeals(uniqueMeals);
    };

    fetchMeals();
  }, [formattedDiningHall, formattedDate, selectedDate]);

  const handleDateChange = (event) => {
    const value = event.target.value;
    setSelectedDate(value);
    setSearchParams(value ? { date: value } : {});
  };

  // format the current date
  return (
    <div className="home-container">
      <h1>{formattedDiningHall} Menu</h1>
      <p className="subtext">Menu for {currentDate}</p>

      <div className="date-picker-row">
        <label className="date-picker-label" htmlFor="menu-date">Select date</label>
        <input
          id="menu-date"
          className="date-picker-input"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <div className="home-buttons">
        {meals.length > 0 ? (
          meals.map((meal, index) => (
            <Link key={index} to={`/${diningHall}/${meal}?date=${selectedDate}`}>
              <button className="btn-auth btn-dining">{meal}</button>
            </Link>
          ))
        ) : (
          <p>No meals found for this date.</p>
        )}
      </div>

      <Link to="/home">
        <button className="btn-auth btn-secondary btn-dining mt-3">Back to Home</button>
      </Link>
    </div>
  );
};

export default DiningHall;
