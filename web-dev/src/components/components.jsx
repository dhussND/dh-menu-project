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
import '../Styles/Auth.css';

export default function Components() {
    return (
        <Router>
            <div style={{ 
                maxWidth: '800px', 
                margin: '0 auto', 
                padding: '0 1rem',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Navbar />
                <main style={{ 
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
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