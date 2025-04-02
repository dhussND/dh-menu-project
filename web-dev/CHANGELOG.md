# Changelog


All notable changes to this project will be documented in this file.

---

## [1.0.0] - 2025-04-02

### Added
- **Authentication Service**: Integrated login, register, and logout functionality using `Parse`.
- **Protected Routes**: Implemented `ProtectedRoute` component to restrict access to authenticated users.
- **Routing Structure**: Set up route paths for `/auth`, `/home`, `/[diningHall]`, and `/[diningHall]/[meal]`.

### Changed
- **Component Styling Overhaul**: Removed all inline styles and replaced them with reusable CSS classes via `App.css`.
- **Responsive Layouts**: Standardized container widths, paddings, and button sizes for better consistency across pages.
- **Navbar Logic**: Updated `Navbar` component to dynamically show/hide links based on user authentication state.

### Fixed
- **Navbar Reactivity**: Resolved issue where the navbar didn't reflect login/logout changes by using `useState` and `useEffect`.