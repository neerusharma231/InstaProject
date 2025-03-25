import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";

const PrivateRoute = () => {
    const { userId, token } = useContext(AuthContext);

    // Redirect to login if no userId or token
    return userId && token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
