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
        <div className="auth-page">
            <div className="auth-container">
                <Link to="/auth/register">
                    <button>Register</button>
                </Link>
                <br />
                <br />
                <Link to="/auth/login">
                    <button>Login</button>
                </Link>
            </div>
        </div>
    );
};

export default AuthModule;
