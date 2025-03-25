import React, { useState,useContext,useEffect } from "react";
import "../css/addbdy.css";
import { AuthContext } from "../AuthContext/AuthContext";
import { Link } from "react-router-dom";
import cake1 from "../assests/cake1.png";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Modal from "./Modal";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
const AddBdy  = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { user, login } = useContext(AuthContext); 
  const navigate = useNavigate();
  // const { user } = useContext(AuthContext);
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login"); // Redirect if not logged in
  //   }
  // }, [user, navigate]);
  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

 
  const currentYear = 2024;
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i);

 
  const handleMonthChange = (event) => {
    const month = parseInt(event.target.value, 10);
    setSelectedMonth(month);
    updateDates(month, selectedYear); 
  };


  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);
    updateDates(selectedMonth, year); 
  };


  const updateDates = (month, year) => {
    if (!month || !year) {
      setDates([]); 
      return;
    }

    const lastDayOfMonth = new Date(year, month, 0).getDate(); 
    const newDates = Array.from({ length: lastDayOfMonth }, (_, i) => i + 1); 
    setDates(newDates);
  };
  useEffect(() => {
    const savedUserData = sessionStorage.getItem("signupData");
    if (savedUserData) {
      const { userName, password } = JSON.parse(savedUserData);
      setUserName(userName);
      setPassword(password);
    }
  }, []);
  
  const loginHandler = async () => {
    console.log("UserName:", userName);
    console.log("Password:", password);
    console.log("Selected Year:", selectedYear);
    console.log("Selected Month:", selectedMonth);
    console.log("Selected Date:", selectedDate);
    if (!userName || !password || !selectedYear || !selectedMonth || !selectedDate) {
        alert("Please fill all fields correctly");
        return;
    }

    // Format the month and date to always have two digits
    const formattedMonth = selectedMonth.toString().padStart(2, "0"); // Converts 8 to 08

    const formattedDate = selectedDate.toString().padStart(2, "0");   // Converts 5 to 05

    const birthDate = `${selectedYear}-${formattedMonth}-${formattedDate}`;

    const savedUserData = sessionStorage.getItem("signupData");
    if (!savedUserData) {
        alert("User data is missing. Please restart the registration.");
        return;
    }

    const { email, fullName, userName: storedUserName, password: storedPassword } = JSON.parse(savedUserData);

    const finalData = {
        email,
        fullName,
        userName: storedUserName,
        password: storedPassword,
        dateOfBirth: birthDate, 
    };

    console.log("Final User Data:", finalData);

    try {
      const response = await axios.post("http://localhost:5004/api/users/register", finalData);
      
      console.log("Backend Response:", response.data);
  
      // ✅ Extract userId safely
      const userId = response.data?.user?._id;
  
      if (!userId) {
          console.error("User ID not found in response!");
          alert("User ID missing. Please check backend response.");
          return;
      }
  
      // ✅ Store userId in sessionStorage
      sessionStorage.setItem("userId", userId);
      console.log("Stored User ID:", sessionStorage.getItem("userId"));
  
      // ✅ Registration success message
      console.log("User Registered Successfully:", response.data);
      alert("Registration Successful!");
  
      // ✅ Navigate after successful registration
      navigate("/");
  } catch (error) {
      console.error("Error Registering User:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration Failed. Try Again.");
  }
  
};


  return (
    <div>
      <div className="bdy-container1">
        <div className="box-1-bdy">
          <div className="box-bdy-logos">
            <img src={cake1} alt="Vote Join" className="cake" />
          </div>
          <div className="adding-bdy">
            <span>Add your Birthday</span>
          </div>
          <div className="phn-bdy">
            <span>This won't be a part of your public profile.</span>
          </div>
          <div className="need-bdy">
            <Link className="need-bdy1">
              <span>Why do I need to provide my birthday?</span>
            </Link>
          </div>
          
          <div className="selector">
           <div className="months-selector">
           <select onChange={handleMonthChange} value={selectedMonth}>
              <option  value="" disabled>MM</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
           </div>
           

             <div className="year-selector">
             <select onChange={handleYearChange} value={selectedYear}>
              <option value="" disabled>Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
     
             </div>
              
              <div className="date-selector">
              <select onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate}>
              <option value="" disabled>Date</option>
              {dates.length > 0 ? (
                dates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))
              ) : (
                <option value="" disabled>No dates available</option>
              )}
            </select>
                </div> 
          </div>

          
      

          <div className="born-date">
            <span>You need to enter the date you were born</span>
          </div>

          <div className="normal-text">
            <span>Use your own birthday, even if this account is for a business, a pet, or something else</span>
          </div>

          <div className="next">
      <Link to="" className="next-links">
        <button 
          className="next-btn" 
          onClick={loginHandler} 
          disabled={loading} 
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {loading ? <CircularProgress size={24} style={{ position: 'absolute' }} /> : 'Next'}
        </button>

        {showModal && (
          <Modal 
          message="We Couldn't Create an Account for You"
          onClose={() => setShowModal(false)}
          />
        )}
      </Link>
    </div>
          <div>
            <Link to="/signup" className="go-back"><span>Go back</span></Link>
          </div>

          <div className="create-new-bdy">
            <Link to="/login" className="create-new-bdy1">
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBdy;
