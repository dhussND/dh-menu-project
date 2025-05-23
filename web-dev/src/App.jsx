import React from 'react';
import Parse from 'parse';
import Env from './environments';
import Components from "./components/components.jsx";

// Initialize Parse
Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;

function App() {
  return <Components />;
}

export default App;