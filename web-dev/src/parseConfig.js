// src/parseConfig.js
import Parse from "parse";

const env = {
  APPLICATION_ID: "JYuuToLFr527wvq3Be7oWjWgA86bvvrIridk2kC6",
  JAVASCRIPT_KEY: "4zyD4yvlZO0Mz3QJF0EJHvIqflZWxWA0OF5sfIaj",
  SERVER_URL: "https://parseapi.back4app.com"
};

Parse.initialize(env.APPLICATION_ID, env.JAVASCRIPT_KEY);
Parse.serverURL = env.SERVER_URL;

export default Parse;
