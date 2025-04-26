import React from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Routes,
    Route,
} from "react-router-dom";
import AuthModule from "./Auth/Auth.jsx";
import AuthRegister from "./Auth/AuthRegister.jsx";
import AuthLogin from "./Auth/AuthLogin.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import Navbar from "./Navbar.jsx";
import Home from "./Pages/Home.jsx";
import DiningHall from './Pages/DiningHall.jsx';
import Meal from './Pages/Meal.jsx';
import '../Styles/theme.css';

export default function Components() {
    return (
        <Router>
            <div>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/auth" element={<AuthModule />} />
                        <Route path="/auth/register" element={<AuthRegister />} />
                        <Route path="/auth/login" element={<AuthLogin />} />
                        <Route path="/home" element={<ProtectedRoute path="/" element={Home} />} />
                        <Route path="/:diningHall" element={<ProtectedRoute path="/" element={DiningHall} />} />
                        <Route path="/:diningHall/:meal" element={<ProtectedRoute path="/" element={Meal} />} />
                        <Route path="*" element={<Navigate to="/auth" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
