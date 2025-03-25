import React, { useState, useRef, useEffect, useContext } from "react";
import "../css/sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import MusicVideoIcon from "@mui/icons-material/MusicVideo";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FavouriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderRounded";
import AddBoxOutLinedIcon from "@mui/icons-material/AddBoxOutlined";
import GestureIcon from "@mui/icons-material/Gesture";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import { Popper, Box, Typography } from '@mui/material';
import { IoSettingsOutline } from "react-icons/io5";
import main_logo1 from "../assests/insta_lg.png";
import { GoReport } from "react-icons/go";
import UploadModal from "./UploadModal"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../AuthContext/AuthContext";
import boy from "../assests/boy.png";
const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const anchorRef = useRef(null);
  const popperRef = useRef(null);
  const { user, logout,  } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState(null);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  // Extract userId from token
  const getUserIdFromToken = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken(); // Extract userId

  // Fetch user details (profile picture)
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:5004/api/users/profile/${userId}`);
        console.log("sfdfdf", response.data);
        setUserData(response.data); 
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleLogout = () => {
    // Clear session data (localStorage or sessionStorage)
    sessionStorage.clear(); // Clear all session data
    logout(); // Call logout function from AuthContext
    
    
    logout(); 
  
    navigate("/login");
  };
  
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenModal = ()=>{
    setOpenModal(true);
  }
  const handleCloseModal = ()=>{
    setOpenModal(false);
  }
  const handleSearch  = () =>{
    alert("Search");
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popperRef.current && !popperRef.current.contains(event.target) &&
        anchorRef.current && !anchorRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="leftSidePart">
      <div className="logoPart">
        <Link to="/">
          <img className="logoImg" src={main_logo1} alt="Instagram Logo" />
        </Link>
      </div>
      <div className="navLinkPart">
        <Link to="/" className="navLink">
          <HomeIcon sx={{ fontSize: "30px",color:"#000", margin: "0 20px 0 0" }} />
          <div className="navName">Home</div>
        </Link>
        <div className="navLink">
          <SearchIcon sx={{ fontSize: "30px", margin: "0 20px 0 0" }} />
          <div className="navName" onClick={handleSearch}>Search</div>
        </div>
        <div className="navLink">
          <ExploreIcon sx={{ fontSize: "30px", margin: "0 20px 0 0" }} />
          <div className="navName">Explore</div>
        </div>
        <div className="navLink">
          <MusicVideoIcon sx={{ fontSize: "30px", margin: "0 20px 0 0" }} />
          <div className="navName">Reels</div>
        </div>
        <div className="navLink">
          <EmailOutlinedIcon sx={{ fontSize: "30px", margin: "0 20px 0 0" }} />
          <div className="navName">Messages</div>
        </div>
        <div className="navLink">
          <FavouriteBorderOutlinedIcon sx={{ fontSize: "30px", margin: "0 20px 0 0" }} />
          <div className="navName">Notifications</div>
        </div>
        <div className="navLink" onClick={handleOpenModal} style={{cursor:'pointer'}}>
          <AddBoxOutLinedIcon sx={{ fontSize: "30px", margin: "0 20px 0 0" }} />
          <div className="navName">Create</div>
        </div>
        <Link to="/profile" className="navLink">
        <img
    className="profileImg"
    src={userData?.profilePicture ? `http://localhost:5004${userData.profilePicture}` : {boy}}
    alt="profile"
  />
          <div className="navName">Profile</div>
        </Link>
        <div className="belowPart">
          <div className="navLink">
            <GestureIcon sx={{ fontSize: "30px", margin: "0 20px 0 0" }} />
            <div className="navName">Thread</div>
          </div>
          <div className="navLink" ref={anchorRef} onClick={handleToggle} style={{ cursor: 'pointer' }}>
            <MenuIcon sx={{ fontSize: "30px", margin: "0 20px 0 0" }} />
            <div className="navName">More</div>
          </div>
        </div>
      </div>

      {/* Dropdown options */}
      <Popper ref={popperRef} open={open} anchorEl={anchorRef.current} onClose={handleClose}>
        <Box className="otrg_bx" sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 3,
          width: "210px",
          margin: "10px",
          p: 2,
        }}>
          <Typography className="Sttng_optn paddnop" variant="h6" component="div">
            <IoSettingsOutline sx={{ fontSize: "30px", margin: "0 20px 0 0", marginRight: "20px" }} />
            Settings
          </Typography>
          <Typography className="rpt-optn paddnop" variant="h6" component="div">
            <GoReport sx={{ fontSize: "30px", margin: "0 20px 0 0", marginRight: "20px" }} />
            Report
          </Typography>
          <Typography className="logt_optn paddnop" variant="h6" component="div" onClick={handleLogout}>
            Log out
          </Typography>
        </Box>
      </Popper>

      {/* Upload Modal */}
      <UploadModal open={openModal} onClose={handleCloseModal} />

    </div>
  );
};

export default Sidebar;
