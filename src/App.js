import React from "react";
import Main from "./Components/Main/Main";
import * as Env from "./environments";
import Parse from "parse";

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;


console.log("App.js loaded");

export function App() {
  const [menu, setMenu] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("South Dining Hall Menu");

  useEffect(() => {
    getMenuData().then((data) => {
      console.log("Fetched menu data:", data);
      setMenu(data);
    });
  }, []);

  console.log("Current Search Term:", searchTerm); // Debugging log

  const handleSelectionChange = (event) => {
    setTitle(`${event.target.value}`);
  };

  return html`
    <${Header} title="Menu" />

    <div onChange=${handleSelectionChange}>
      <input
        type="radio"
        id="sdh"
        name="dh"
        value="South Dining Hall"
        checked
      />
      <label for="sdh">South Dining Hall</label><br />
      <input type="radio" id="ndh" name="dh" value="North Dining Hall" />
      <label for="ndh">North Dining Hall</label><br />
    </div>

    <input
      type="text"
      placeholder="Item Search Menu..."
      onInput=${(e) => setSearchTerm(e.target.value.toLowerCase())}
      class="search-bar"
    />
    <${MenuList} menu=${menu} searchTerm=${searchTerm} />
  `;
}

render(html`<${App} />`, document.getElementById("app"));
