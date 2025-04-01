import React from 'react';
import Parse from 'parse';
import Env from './environments';
import components from "./components/components.jsx";

// Initialize Parse
Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

function App() {
  return <components />;
}

export default App;