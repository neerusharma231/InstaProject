import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "./Routes/UserRoutes";
import { AuthProvider } from "./AuthContext/AuthContext";
function App() {
    return (
        <AuthProvider>
<Router>
            <Routes>
                   <Route path="/*" element={<UserRoutes />} />
            </Routes>
        </Router>
        </AuthProvider>
        
    );
}

export default App;
