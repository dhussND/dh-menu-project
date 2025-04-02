import React, { useEffect, useState } from "react";
import { checkUser, loginUser } from "./AuthService";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";

const AuthLogin = () => {
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState({
        email: "",
        password: ""
    });

    // flags in the state to watch for add/remove updates
    const [add, setAdd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (checkUser()) {
            navigate("/home");
        }
    }, [navigate]);

    // useEffect that run when changes are made to the state variable flags
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
                .catch(err => {
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
            [name]: newValue
        });
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        setAdd(true);
    };

    return (
        <div>
            {error && <div className="error-message">{error}</div>}
            {isLoading ? (
                <div className="loading">Logging in...</div>
            ) : (
                <AuthForm
                    user={currentUser}
                    isLogin={true}
                    onChange={onChangeHandler}
                    onSubmit={onSubmitHandler}
                />
            )}
        </div>
    );
};

export default AuthLogin;