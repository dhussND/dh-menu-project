import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DiningHall from './components/DiningHall';
import Meal from './components/Meal';
import Parse from 'parse';
import Env from './environments';

// Initialize Parse
Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:diningHall" element={<DiningHall />} />
        <Route path="/:diningHall/:meal" element={<Meal />} />
      </Routes>
    </Router>
  );
};

export default App;