import React, { useState, useContext } from "react";
import "../css/signup.css";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assests/insta_logo.png";
import { AuthContext } from "../AuthContext/AuthContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function

  const handleSignup = (e) => {
    e.preventDefault();
  
    if (!email || !password || !fullName || !userName) {
      alert("Please fill all fields");
      return;
    }
  
    const userData = { email, password, fullName, userName };
    sessionStorage.setItem("signupData", JSON.stringify(userData));
    login(userData); // ✅ Store user in AuthContext
    console.log(userData);
    navigate("/birthdayform"); // ✅ Navigate to birthday page
  };

  return (
    <div className="sign-head">
      <div className="sign-header">
        <div className="sign-content">
          <div className="logn-inner-content">
            <img src={Logo} alt="insta_logo" className="instas-logo" />
          </div>
          <div className="sgn-content">
            <span>Sign up to see photos and videos from your friends.</span>
          </div>
          <div className="sgn-frm">
            <input
              type="text"
              className="txted"
              placeholder="Phone number or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="txted"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              className="txted"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="text"
              className="txted"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button className="sgnup-btn" onClick={handleSignup}>
              Sign Up
            </button>
          </div>
        </div>
        <div className="sgnup-section">
          <p>Have an account?</p>
          <Link className="lgning-upp" to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
