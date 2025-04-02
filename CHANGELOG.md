Change Log
All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

[Unreleased] - yyyy-mm-dd
Added
(Future features or improvements can be listed here.)

Changed
(Future changes or refactoring can be listed here.)

Fixed
(Future bug fixes can be listed here.)


[0.3.0] - 2025-04-02

Added
- Authentication Service: Integrated login, register, and logout functionality using `Parse`.
- Protected Routes: Implemented `ProtectedRoute` component to restrict access to authenticated users.
- Routing Structure: Set up route paths for `/auth`, `/home`, `/[diningHall]`, and `/[diningHall]/[meal]`.

Changed
- Component Styling Overhaul: Removed all inline styles and replaced them with reusable CSS classes via `App.css`.
- Responsive Layouts: Standardized container widths, paddings, and button sizes for better consistency across pages.
- Navbar Logic: Updated `Navbar` component to dynamically show/hide links based on user authentication state.

Fixed
- Navbar Reactivity: Resolved issue where the navbar didn't reflect login/logout changes by using `useState` and `useEffect`.


[0.2.0] - 2025-03-07
Changed
Refactored code from Preact to React.

Updated the project to support local development with Vite instead of CodeSandbox.

Integrated Parse and Back4App for backend data management, enabling dynamic loading of dining hall menus, meals, stations, and food items.

[0.1.0] - 2025-02-20
Added
Implemented all core features of the app using Preact.

Added functionality to load data dynamically from the backend.

Implemented a search bar to filter food items and stations.
