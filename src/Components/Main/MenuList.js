import {
  html,
  useState,
} from "https://unpkg.com/htm/preact/standalone.module.js";

export const MenuList = ({ menu = {}, searchTerm = "" }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return html`
    <div class="menu">
      ${!menu || Object.keys(menu).length === 0
        ? html`<p>Loading menu...</p>`
        : Object.keys(menu)
            .filter((category) =>
              menu[category].some((item) =>
                item.toLowerCase().includes(searchTerm)
              )
            )
            .map(
              (category) => html`
                <div class="menu-category">
                  <h3 onClick=${() => toggleCategory(category)}>
                    ${category.replace(/-/g, " ")}
                    <span
                      class="arrow ${expandedCategory === category
                        ? "down"
                        : "right"}"
                    >
                      ${expandedCategory === category ? "⮟" : "➤"}
                    </span>
                  </h3>
                  ${expandedCategory === category
                    ? html`<ul>
                        ${menu[category]
                          .filter((item) =>
                            item.toLowerCase().includes(searchTerm)
                          )
                          .map((item) => html`<li>${item}</li>`)}
                      </ul>`
                    : ""}
                </div>
              `
            )}
    </div>
  `;
};

export default MenuList;
