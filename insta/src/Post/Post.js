import React, { useRef, useEffect, useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import boy from "../assests/boy.png";

const Post = () => {
  const [images, setImages] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [showComments, setShowComments] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  // ✅ Get UserId from JWT Token
  const getUserIdFromToken = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;
    const decodedToken = jwtDecode(token);
    return decodedToken.userId;
  };

  // ✅ Fetch Posts
  useEffect(() => {
    const fetchImages = async () => {
      const userIdFromToken = getUserIdFromToken();
      try {
        const response = await axios.get(
          `http://localhost:5004/api/uploads/uploads?userId=${userIdFromToken}`
        );
        const sortedImages = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setImages(sortedImages);

        sortedImages.forEach((post) => fetchUserProfile(post.userId));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  // ✅ Fetch user profile picture
  const fetchUserProfile = async (id) => {
    if (userProfiles[id]) return;

    try {
      const response = await axios.get(
        `http://localhost:5004/api/users/profile/${id}`
      );
      setUserProfiles((prev) => ({
        ...prev,
        [id]: response.data.profilePicture,
      }));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // ✅ Handle Like/Unlike
  const handleLike = async (postId) => {
    const userId = getUserIdFromToken();
    if (!userId) return console.error("User ID is missing from token.");

    try {
      const response = await axios.put(
        `http://localhost:5004/api/uploads/like/${postId}`,
        { userId }
      );
      const updatedImages = images.map((image) => {
        if (image._id === postId) {
          return {
            ...image,
            likes_count: image.isLiked
              ? image.likes_count - 1
              : image.likes_count + 1,
            isLiked: !image.isLiked,
          };
        }
        return image;
      });
      setImages(updatedImages);
    } catch (error) {
      console.error(
        "Error liking post:",
        error.response?.data || error.message
      );
    }
  };
  // ✅ Fetch Comments (GET /all)
  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5004/api/comments/all?postId=${postId}`);
     console.log("dfdgfgdg",response.data)
      setComments((prev) => ({
        ...prev,
        [postId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const handleCommentClick = (postId) => {
    if (showComments === postId) {
      setShowComments(null);
    } else {
      setShowComments(postId);
      fetchComments(postId); // Fetch comments when opening
    }
  };
 // ✅ Handle Comment Submission (POST /add)
 const handleCommentSubmit = async (e, postId) => {
  e.preventDefault();
  const userId = getUserIdFromToken();
  if (!userId || !commentText.trim()) return;

  try {
    const newComment = {
      userId,
      postId,
      text: commentText,
      createdAt: new Date(),
    };

    const response = await axios.post("http://localhost:5004/api/comments/add", newComment);
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), response.data],
    }));
    setCommentText("");
  } catch (error) {
    console.error("Error posting comment:", error);
  }
};

  return (
    <div className="posts-container">
      {images.length > 0 ? (
        images.map((image, index) => (
          <div key={image._id} className="post-wrapper">
            <div className="post">
              <div className="fdgtdrgfg">
                <div className="header-info">
                  <img
                    className="postInfoImg"
                    src={
                      userProfiles[image.userId]
                        ? `http://localhost:5004${userProfiles[image.userId]}`
                        : boy
                    }
                    alt="profile"
                  />
                  <div className="postInfousername">cotton_bro</div>
                </div>

                <div className="postInfo">
                  <div className="imageContainer">
                    {image.fileType === "image" ? (
                      <img
                        className="postImage"
                        src={`http://localhost:5004${image.filePath}`}
                        alt={`post_img_${index}`}
                      />
                    ) : image.fileType === "video" ? (
                      <video className="postImage" controls>
                        <source
                          src={`http://localhost:5004${image.filePath}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                  </div>
                </div>

                {/* ✅ Like/Comment Icons */}
                <div className="iconsBlock">
                  <div className="leftIcon">
                    <span
                      onClick={() => handleLike(image._id)}
                      style={{ cursor: "pointer" }}
                    >
                      {image.isLiked ? (
                        <FavoriteIcon sx={{ color: "red", fontSize: "25px" }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ fontSize: "25px" }} />
                      )}
                    </span>
                    <span
                      onClick={() => handleCommentClick(image._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <ModeCommentOutlinedIcon sx={{ fontSize: "25px" }} />
                    </span>
                    <SendIcon sx={{ fontSize: "25px" }} />
                  </div>
                  <div>
                    <BookmarkBorderOutlinedIcon sx={{ fontSize: "25px" }} />
                  </div>
                </div>

                {/* ✅ Likes Section */}
                <div className="likeSection">
                  <div className="imagesLike">
                    <img
                      className="likeImg"
                      src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQZisIqdLFTjIj4VhyzmS5wlsGLOakLpz28dX5tJyYt0zP5j6TQ"
                      alt="likeImg"
                    />
                    <img
                      className="likeImg2"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR28Auo3SvCkU5bbulU2QpvkORpvTBFQAthiw&s"
                      alt="likeImg2"
                    />
                  </div>
                  <div className="noOfLikes">{image.likes_count} Likes</div>
                </div>

                <div className="postAbout">
                  <div className="postAboutName">barackobama</div>
                  <div className="InfoComment">{image.caption}</div>
                </div>

                <div className="timeAgo">
                  {moment(image.createdAt).fromNow()}
                </div>
                <div
                  className="noOfComment"
                  onClick={() => handleCommentClick(image._id)}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  View All 467 Comments
                </div>
              </div>
              {/* ✅ Comment Section (Inside the Post) */}
              <div className="inside_cmnt">
                {showComments === image._id && (
                 <div className="comment-section">
                 <h4>Comments</h4>
                 <div className="comment-content">
                   <div className="comment_area">
                     <ul className="social-comments-list">
                       {comments[image._id] && comments[image._id].length > 0 ? (
                         comments[image._id].map((comment, index) => (
                           <li key={index} className="comment-item">
                             <div className="comment-user-info">
                               <img
                                 className="comment-profile-img"
                                 src={comment.profilePicture}
                                 alt="user-profile"
                               />
                               <strong className="comment-username">{comment.username}</strong>
                             </div>
                             <p className="comment-text">{comment.commentText}</p>
                           </li>
                         ))
                       ) : (
                         <p>No comments yet</p>
                       )}
                     </ul>
                   </div>
                   <div className="posted_areas">
                     <form
                       onSubmit={(e) => handleCommentSubmit(e, image._id)}
                       className="social-comment-form"
                     >
                       <input
                         className="commt_prt"
                         type="text"
                         value={commentText}
                         onChange={(e) => setCommentText(e.target.value)}
                         placeholder="Add a comment"
                       />
                       <button className="post_sbmted" type="submit">
                         Post
                       </button>
                     </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

export default Post;
