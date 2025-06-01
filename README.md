# Dining Hall Menu Redesign

**Group:**  
- Dan Huss  
- Vincent Galassi  

---

## Problem

Notre Dame's dining hall website (https://dining.nd.edu) has several issues that result in poor UX/UI, including:

- Redundant interactions due to poor routing
- Frequent server downtime, making the menu inconveniently inaccessible
- Outdated styling that doesn’t meet modern design standards

---

## Solution

This project addresses these issues and introduces other improvements for a significantly better user experience. The core of the project is a Python script (`get_menu_back4app.py`) that scrapes the dining hall’s menu data and uploads it to a Back4App backend. The React frontend then delivers a refreshed, modern site with improved UX/UI.

---

## Usage

To run the project locally:

```bash
# Clone the repository
git clone https://github.com/dhussND/dh-menu-project.git

# Navigate to the frontend directory
cd dh-menu-project/web-dev

# Install dependencies (if needed)
npm install

# Start the development server
npm run dev
