import React, { useState } from 'react';
import '../css/forgot.css';
import { Link } from "react-router-dom";
import Lock1 from "../assests/lock1.png";
const ForgotPassword = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = () => {
    
    console.log("Logging in with:", userName, password);
  };
  return (
    <div>
      
      <div className='forget-container1'>
              <div className="box-1-forget">
                <div className='box-frgt-logo'>
                  <img src={Lock1} alt='Vote Join' className='votejoin-logo-forget' />
                  {/* < LockOutlinedIcon style={{ fontSize: '90px' }}/> */}
                 
                </div>
                <div className='trouble-text'>
                <span>Trouble logging in?</span>
                </div>
                <div className='phn-email'>
                  <span>Enter your email, phone, or username and we'll send you a link to get back into your account.</span>
                </div>
                <div className='input-box'>
                  <input
                    type="text"
                    placeholder='Email, Phone, or Username'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
               
                <div className='login-button-box'>
                 <Link to="forgotpassword"><button className='login-button-forget' onClick={loginHandler}>Send Login Link</button> </Link> 
                </div>
              
                <div className='lines-box-forget'>
                  <div className='line-1-forget'></div>
                  <div className='or-box'>OR</div>
                  <div className='line-2-forget'></div>
                </div>
                
                <div className='create-new-one'>
                 <Link to="/signup" className='create-new-one1'> <span>Create new account</span></Link> 
                </div>

                <div className='create-new-login'>
                 <Link to="/login" className='create-new-login1'> <span>Back to Login</span></Link> 
                </div>
              </div>
            </div>
    </div>
  )
}

export default ForgotPassword
