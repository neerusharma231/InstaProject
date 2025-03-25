import React, { useState, useEffect, useContext } from "react";
import "../css/login.css";
import Logo from "../assests/insta_logo.png";
import { FaFacebook } from "react-icons/fa";
import HomePhone from "../assests/home-phones.png";
import Micro from "../assests/getMicrosoft.png";
import Play from "../assests/play.png";
import ig from "../assests/ig.png";
import ig1 from "../assests/ig1.png";
import { AuthContext } from "../AuthContext/AuthContext";
import ig2 from "../assests/ig2.png";
import ig3 from "../assests/ig3.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { jwtDecode } from "jwt-decode";
const Login = () => {
    const overlayImages = [ig, ig1, ig2, ig3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % overlayImages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

   
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5004/api/users/login",
                { emailOrUsername, password }, // ✅ Send emailOrUsername
                { headers: { "Content-Type": "application/json" } }
            );
    
            if (response.status === 200 && response.data.token) {
                const { token } = response.data;
                sessionStorage.setItem("token", token); 
                
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                // console.log("Decoded Token:", decodedToken);
    
                sessionStorage.setItem("userId", userId);
                login(userId, token); 
    
                toast.success("Signin successful! Redirecting...", { autoClose: 2000 });
    
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                toast.error("Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error.response ? error.response.data : error.message);
            toast.error("Login failed. Please try again.");
        }
    };
    
    return (
        <>
            <ToastContainer /> {/* Ensure ToastContainer is inside the return statement */}
            <div className="logn-head">
                <div className="homepge" style={{ backgroundImage: `url(${HomePhone})` }}>
                    <img src={overlayImages[currentImageIndex]} alt="overlay" className="overlay-img" />
                </div>
                <div className="logn-header">
                    <div className="lgn-content">
                        <div className="logn-inner-content">
                            <img src={Logo} alt="insta_logo" className="insta-logo" />
                        </div>
                        <div className="logn-frm">
                        <input
                                type="text"
                                className="txt"
                                placeholder="username, or email" // ✅ Updated placeholder
                                value={emailOrUsername} // ✅ Updated state
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className="txt"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button className="login-btn" onClick={handleLogin}>Log In</button>
                        </div>
                        <div className="or-separator">
                            <span className="line"></span>
                            <span className="or-text">OR</span>
                            <span className="line"></span>
                        </div>
                        <div className="facebook-logn">
                            <FaFacebook className="facebook-icon" />
                            <span>Log in with Facebook</span>
                        </div>
                        <div className="forgot-password">
                            <Link className="frgotpass" to="/forgotpassword">
                                <span className="forget-passs">Forgot Password?</span>
                            </Link>
                        </div>
                    </div>
                    <div className="sgn-up">
                        <p>Don't have an account?</p>
                        <Link className="sgn-upesd" to="/signUp">
                            <span className="sgningg-up">Sign Up</span>
                        </Link>
                    </div>
                    <div className="get-app">
                        <span>Get the App</span>
                    </div>
                    <div className="micro-play">
                        <img src={Micro} alt="micro" className="micro" />
                        <img src={Play} alt="play" className="micro" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
