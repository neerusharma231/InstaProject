import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => sessionStorage.getItem("token") || null);
    const [userId, setUserId] = useState(() => sessionStorage.getItem("userId") || null);

    useEffect(() => {
        // Restore token and userId from sessionStorage on page refresh
        const storedToken = sessionStorage.getItem("token");
        const storedUserId = sessionStorage.getItem("userId");

        if (storedToken) setToken(storedToken);
        if (storedUserId) setUserId(storedUserId);
    }, []);

    // Function to log in the user
    const login = (userId, token) => {
        setUserId(userId);
        setToken(token);
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("token", token); // ✅ Store token
    };

    // Function to log out the user
    const logout = () => {
        setUserId(null);
        setToken(null);
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("token"); // ✅ Remove token on logout
    };

    return (
        <AuthContext.Provider value={{ userId, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
