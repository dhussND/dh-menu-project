import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { checkUser } from "./AuthService";
import "../../Styles/Auth.css";

const AuthModule = () => {
    const navigate = useNavigate();

    // redirect already authenticated users back to home
    useEffect(() => {
        if (checkUser()) {
            alert("You are already logged in");
            navigate("/home");
        }
    }, [navigate]);

    return (
        <div className="auth-page" style={{ width: '100%' }}>
            <div className="auth-container" style={{ 
                textAlign: 'center', 
                maxWidth: '500px', 
                margin: '0 auto',
                width: '100%',
                padding: '0 1rem'
            }}>
                <h1>Welcome to Notre Dame Dining Hall Menus</h1>
                <p style={{ 
                    marginBottom: '2rem',
                    fontSize: '1.1rem',
                    lineHeight: '1.6'
                }}>
                    Access dining menus for North and South Dining Halls.
                    Please log in or register to continue.
                </p>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem',
                    width: '100%'
                }}>
                    <Link to="/auth/register">
                        <button className="btn-primary" style={{ width: '100%' }}>Register</button>
                    </Link>
                    <Link to="/auth/login">
                        <button className="btn-primary" style={{ width: '100%' }}>Login</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthModule;