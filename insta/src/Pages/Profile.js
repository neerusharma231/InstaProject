import React, { useRef, useState, useEffect } from "react";
import "../css/profile.css";
import axios from "axios";
import dp from "../assests/prof_dp.jpeg";
import post from "../assests/post_icon.webp";
import taged from "../assests/taged.png";
import saved from "../assests/saved.png";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { Link } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [images, setImages] = useState([]);
  const [userName, setUserName] = useState(""); // Store username
  const videoRef = useRef(null);
  const [user, setUser] = useState(null);
  // ✅ Function to get user details from token
  const getUserIdFromToken = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken); // Debugging

      return {
        userId: decodedToken.userId || null,
        userName: decodedToken.userName || "Unknown User",
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  // ✅ Fetch user details
  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5004/api/users/profile/${userId}`
      );
      console.log("response will be:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    const userData = getUserIdFromToken(); // ✅ Get user object
    if (userData?.userId) {
      fetchUserDetails(userData.userId); // ✅ Fetch user details
      console.log("jsfgsf", userData.userId)
      setUserName(userData.userName); // ✅ Store username
  
      // ✅ Fetch images only if userId exists
      const fetchImages = async () => {
        try {
          const response = await axios.get(`http://localhost:5004/api/uploads/uploads?userId=${userData.userId}`);
          
          if (response.data && Array.isArray(response.data)) {
            // ✅ Ensure only the logged-in user's posts are shown
            const filteredImages = response.data.filter(img => img.userId === userData.userId);
      
            const sortedImages = filteredImages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setImages(sortedImages);
          } else {
            console.error("Unexpected API response:", response.data);
            setImages([]);
          }
        } catch (error) {
          console.error("Error fetching images:", error);
          setImages([]);
        }
      };
      
      fetchImages();
    }
  }, []); 
  

  return (
    <>
      <div className="profile_mainpage">
        <Sidebar />
        <div className="profile_midsec-posts">
          <div className="profile_Section">
            <div className="profile_sc">
              <div className="profile_usrnme">
              <img
                className="profile_img"
                src={
                  user?.profilePicture
                    ? `http://localhost:5004${user.profilePicture}`
                    : dp
                }
                alt="Profile"
                onError={(e) => {
                  e.target.src = dp;
                }} // Fallback if the image fails to load
              />
               <h4>{user?.fullName || "User Name Not Found"}</h4>
              </div>
             
              {" "}
              <div className="profile_username">
                {/* Display the username */}
              <div><h3>{user?.userName || "User Name Not Found"}</h3>
              </div>  
                {/* ✅ Display username */}
               <div> {user && <h5>{user.bio}</h5>}</div> 

                <Link className="edt_prfle" to="/editprofile">
                  <button className="edt_profile">Edit Profile</button>
                </Link>
                <ul className="profile_follwing">
                  <li>2 Posts</li>
                  <li>4 Followers</li>
                  <li>6 Following</li>
                </ul>
              </div>
            </div>

            {/* Profile section below */}
            <div className="profile_sc_below">
              <ul className="top_header">
                <li className="post_posting">
                  <img className="saved_icon" src={post} alt="Posts" /> Posts
                </li>
                <li className="post_posting">
                  <img className="saved_icon" src={saved} alt="Saved" /> Saved
                </li>
                <li className="post_posting">
                  <img className="saved_icon" src={taged} alt="Tagged" /> Tagged
                </li>
              </ul>
            </div>

            {/* Posts Section */}
            <div className="post_parting">
              {images.length > 0 ? (
                images.map((image, index) => (
                  <div className="item_post" key={index}>
                    {image.fileType.startsWith("image") ? (
                      <img
                        className="postImage"
                        src={`http://localhost:5004${image.filePath}`}
                        alt={`post_img_${index}`}
                      />
                    ) : image.fileType.startsWith("video") ? (
                      <video className="postImage" controls ref={videoRef}>
                        <source
                          src={`http://localhost:5004${image.filePath}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                    <div className="iconsBlock1">
                      <div className="leftIcon1">
                        <FavoriteIcon sx={{ fontSize: "25px" }} /> 51
                        <ModeCommentIcon sx={{ fontSize: "25px" }} /> 100
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No posts found</div>
              )}
            </div>
            {/* End of post section */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
