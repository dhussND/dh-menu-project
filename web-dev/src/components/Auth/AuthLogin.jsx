// src/components/Auth/AuthLogin.jsx

import React, { useEffect, useState } from "react";
import { checkUser, loginUser } from "./AuthService";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import "../../styles/theme.css";

const AuthLogin = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState({
        email: "",
        password: "",
    });

    const [add, setAdd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (checkUser()) {
            navigate("/home");
        }
    }, [navigate]);

    useEffect(() => {
        if (currentUser && add) {
            setIsLoading(true);
            setError(null);

            loginUser(currentUser)
                .then((userLoggedIn) => {
                    if (userLoggedIn) {
                        navigate("/home");
                    }
                })
                .catch((err) => {
                    setError(err.message || "Login failed. Please try again.");
                })
                .finally(() => {
                    setAdd(false);
                    setIsLoading(false);
                });
        }
    }, [navigate, currentUser, add]);

    const onChangeHandler = (e) => {
        e.preventDefault();
        const { name, value: newValue } = e.target;

        setCurrentUser({
            ...currentUser,
            [name]: newValue,
        });
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        setAdd(true);
    };

    return (
        <div className="auth-landing">
            <div className="auth-container">
                <h2>Login</h2>
                <p>Enter your credentials to access dining menus.</p>

                {error && <div className="auth-error">{error}</div>}
                {isLoading ? (
                    <div className="auth-loading">Logging in...</div>
                ) : (
                    <AuthForm
                        user={currentUser}
                        isLogin={true}
                        onChange={onChangeHandler}
                        onSubmit={onSubmitHandler}
                    />
                )}
            </div>
        </div>
    );
};

export default AuthLogin;
