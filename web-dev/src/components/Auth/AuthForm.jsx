// src/components/Auth/AuthForm.jsx

import React from "react";

const AuthForm = ({ user, isLogin, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="nd-auth-form">
      {!isLogin && (
        <>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={onChange}
              required
              className="nd-input"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={onChange}
              required
              className="nd-input"
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={onChange}
          required
          className="nd-input"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={onChange}
          required
          className="nd-input"
        />
      </div>

      <button type="submit" className={`btn-auth ${isLogin ? "btn-login" : "btn-register"}`}>
        {isLogin ? "Login" : "Register"}
      </button>

      {isLogin ? (
        <p className="auth-switch-text">
          Don’t have an account? <a href="/auth/register">Register</a>
        </p>
      ) : (
        <p className="auth-switch-text">
          Already have an account? <a href="/auth/login">Login</a>
        </p>
      )}
    </form>
  );
};

export default AuthForm;
