import { html } from "https://unpkg.com/htm/preact/standalone.module.js";

export const Header = ({ title, data }) => html`
  <header>
    <h1>${title}</h1>
    ${data ? html`<pre>${JSON.stringify(data, null, 2)}</pre>` : ""}
  </header>
`;
