import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import ForgotPassword from "../Pages/ForgotPassword";
import Sidebar from "../Component/Sidebar";
import HomePage from "../Pages/HomePage";
import PrivateRoute from "../Component/PrivateRoute"; // Import PrivateRoute
import AddBdy from "../Pages/AddBdy"; // Import AddBdy
import Profile from "../Pages/Profile";
import EditProfile from "../Pages/EditProfile";
const UserRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
     
      {/* Private Routes (Protected) */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/sidebar" element={<Sidebar />} />
      <Route path="/birthdayform" element={<AddBdy />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/editprofile" element={<EditProfile />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
