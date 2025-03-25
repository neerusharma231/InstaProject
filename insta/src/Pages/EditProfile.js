import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../css/edtprofile.css";
import Sidebar from "../Component/Sidebar"; 
import Profile from "../assests/noImage.jpg";

const EditProfile = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [fullName, setfullName] = useState("");
  const [userId, setUserId] = useState(null);

  // Function to extract userId from token
    const getUserIdFromToken = () => {
      const token = sessionStorage.getItem("token");
      if (!token) return null;
  
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken); 
      return decodedToken.userId; 
    };

  useEffect(() => {
    const userIdFromToken = getUserIdFromToken(); 
    if (!userIdFromToken) {
      alert("User not authenticated. Please login again.");
      return;
    }
    setUserId(userIdFromToken);

    // Fetch user details using userId
    axios.get(`http://localhost:5004/api/users/profile/${userIdFromToken}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    })
    .then(response => {
      const user = response.data;
      console.log("Updated User Data:", response.data); // ✅ LOG UPDATED DATA
      setUserName(user.userName);
      setBio(user.bio);
      setfullName(user.fullName);
      setGender(user.gender);
      if (user.profilePicture) {
        setProfilePhoto(`http://localhost:5004${user.profilePicture}`);
      }
    })
    .catch(error => console.error("Error fetching user details:", error));
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setProfilePhoto(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {
    if (!userId) {
      alert("User not authenticated.");
      return;
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("bio", bio);
    formData.append("gender", gender);
    formData.append("password", password);
    formData.append("fullName", fullName);

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput.files[0]) {
      formData.append("profilePicture", fileInput.files[0]);
    }

    try {
      const response = await axios.put(`http://localhost:5004/api/users/profile/${userId}`, formData, 
        {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Attach token for auth
        },
        
      });
     
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="edt_profile">
      <Sidebar />
      <div className="containerest">
        <h2 className="edt_prfole">Edit Profile</h2>
        <div className="profile-card">
          <div className="profile-header">
          <img 
  src={profilePhoto || Profile} 
  alt="Profile" 
  className="profile-image" 
/>
            <label className="photo-button">
              Change Photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>UserName</label>
          <input type="text" className="form-control" placeholder="Enter User Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>FullName</label>
          <input type="text" className="form-control" placeholder="Enter Full Name" value={fullName} onChange={(e) => setfullName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea className="form-control" placeholder="Enter Bio" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Reset Password</label>
          <input type="password" className="form-control" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="frm-btn">
          <button className="update-profile" onClick={handleUpdateProfile}>Update Profile</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
