import React, { useEffect, useState } from "react";
import { checkUser, createUser } from "./AuthService";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import "../../styles/theme.css";

const AuthRegister = () => {
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    if (checkUser()) {
      alert("You are already logged in");
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const userCreated = await createUser(newUser);

    if (userCreated) {
      alert(`${userCreated.get("firstName")}, you successfully registered!`);
      navigate("/home");
    }
  };

  return (
    <div className="auth-landing">
      <div className="auth-container">
        <h2>Register</h2>
        <p>Create your account to explore today's dining hall menus.</p>
        <AuthForm
          user={newUser}
          isLogin={false}
          onChange={onChangeHandler}
          onSubmit={onSubmitHandler}
        />
      </div>
    </div>
  );
};

export default AuthRegister;
