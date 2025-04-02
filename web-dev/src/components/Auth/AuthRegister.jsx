import React, { useEffect, useState } from "react";
import { checkUser, createUser } from "./AuthService";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";

const AuthRegister = () => {
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    // redirect already authenticated users back to home
    useEffect(() => {
        if (checkUser()) {
            alert("You are already logged in");
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    const onChangeHandler = (e) => {
        e.preventDefault();
        console.log(e.target);
        const { name, value: newValue } = e.target;
        console.log(newValue);

        setNewUser({
            ...newUser,
            [name]: newValue
        });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const userCreated = await createUser(newUser);
    
        if (userCreated) {
            alert(`${userCreated.get("firstName")}, you successfully registered!`);
            navigate("/home"); // redirect to homepage
        }
    };

    return (
        <div>
            <AuthForm
                user={newUser}
                onChange={onChangeHandler}
                onSubmit={onSubmitHandler}
            />
        </div>
    );
};

export default AuthRegister;
