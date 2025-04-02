import React from "react";
import { useNavigate } from "react-router-dom";
import { checkUser } from "../Auth/AuthService";

const ProtectedRoute = ({ element: Component }) => {
    const navigate = useNavigate();

    if (checkUser()) {
        return <Component />;
    } else {
        return (
            <Navigate to="/auth" replace />
        );
    }
};

export default ProtectedRoute;
