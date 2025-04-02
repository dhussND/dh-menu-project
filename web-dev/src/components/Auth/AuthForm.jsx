import React from "react";
import { Link } from "react-router-dom";

const AuthForm = ({ user, isLogin, onChange, onSubmit }) => {
    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2 className="auth-title">{isLogin ? "Login" : "Register"}</h2>
                <div className="auth-form-container">
                    <form onSubmit={onSubmit} autoComplete="off">
                        {!isLogin && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="first-name-input">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first-name-input"
                                        value={user.firstName}
                                        onChange={onChange}
                                        name="firstName"
                                        placeholder="First name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="last-name-input">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last-name-input"
                                        value={user.lastName}
                                        onChange={onChange}
                                        name="lastName"
                                        placeholder="Last name"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div className="form-group">
                            <label htmlFor="email-input">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email-input"
                                value={user.email}
                                onChange={onChange}
                                name="email"
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-input">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password-input"
                                value={user.password}
                                onChange={onChange}
                                name="password"
                                placeholder="Your password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                {isLogin ? "Login" : "Register"}
                            </button>
                        </div>
                    </form>
                    <div>
                        {isLogin ? (
                            <Link to="/auth/register" className="auth-link">
                                Don't have an account? Register
                            </Link>
                        ) : (
                            <Link to="/auth/login" className="auth-link">
                                Already have an account? Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;