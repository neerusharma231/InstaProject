import { Modal, Box, Typography, IconButton, Button, TextField } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CollectionsTwoToneIcon from '@mui/icons-material/CollectionsTwoTone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "../css/UploadingModal.css";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadModal = ({ open, onClose, onImageUpload }) => {
  const [files, setFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [nextstep, setNextStep] = useState(false);
  const [caption, setCaption] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ Get UserId from JWT Token
  const getUserIdFromToken = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    const decodedToken = jwtDecode(token);
    return decodedToken.userId; 
  };

  useEffect(() => {
    if (open) {
      const userIdFromToken = getUserIdFromToken();
      setUserId(userIdFromToken);
    }
  }, [open]);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      const file = droppedFiles[0];

      if (file.type.startsWith("image/")) {
        setImagePreview(URL.createObjectURL(file));
      } else if (file.type.startsWith("video/")) {
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      const file = selectedFiles[0];

      if (file.type.startsWith("image/")) {
        setImagePreview(URL.createObjectURL(file));
      } else if (file.type.startsWith("video/")) {
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const handleNext = () => {
    setNextStep(true);
  };

  const handlePrevious = () => {
    setConfirmOpen(true);
  };

  // Confirm discard
  const handleDiscard = () => {
    setFiles([]);
    setImagePreview(null);
    setNextStep(false);
    setCaption('');
    setConfirmOpen(false);
  };

  // Cancel discard
  const handleCancel = () => {
    setConfirmOpen(false);
  };

  // ✅ **Handle Share Button Click (API Call)**
  const handleShare = async () => {
    if (!files.length) {
      toast.error("Please upload a file before sharing.");
      return;
    }
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("caption", caption);
    formData.append("file", files[0]);

    try {
      const response = await axios.post(`http://localhost:5004/api/uploads/upload/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
console.log("dfdf", response.data)
      const filePath = response.data.upload?.filePath || response.data.filePath;
      if (!filePath) throw new Error("File path is missing in response.");

      const imageUrl = `http://localhost:5004${filePath}`;
      sessionStorage.setItem("sharedImage", imageUrl);

      const postCaption = response.data.upload?.caption || response.data.caption;
      if (!postCaption) throw new Error("Caption is missing in response.");

      sessionStorage.setItem("captioned", postCaption);

      if (onImageUpload && typeof onImageUpload === "function") {
        onImageUpload(imageUrl);
      } else {
        console.warn("onImageUpload is not provided or not a function.");
      }

      toast.success("Post shared successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error uploading file:", error?.response?.data || error.message);
      toast.error("Failed to share the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      {/* Main Upload Modal */}
      <Modal open={open} onClose={onClose}>
        <Box
          className="dragpc-img"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '30%',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          {files.length === 0 ? (
            <>
              <Typography variant="h6" sx={{ paddingBottom: 2, borderBottom: '1px solid #ccc' }}>
                Create a Post
              </Typography>
              <Box
                className="bxmodal"
                sx={{ padding: "60px 20px", height: 200, textAlign: 'center' }}
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
              >
                <CollectionsTwoToneIcon className="imgdg" sx={{ marginBottom: '16px' }} />
                <Typography className="paradg" variant="body2">
                  Drag photos and videos here
                </Typography>
                <button className="dgbtnx" onClick={handleUpload}>Upload</button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/*, video/*"
                  multiple
                />
              </Box>
            </>
          ) : !nextstep ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton onClick={handlePrevious}><ArrowBackIcon /></IconButton>
                <Typography variant="h6">Create a Post</Typography>
                <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
              </Box>
              {imagePreview && (
                <Box sx={{ mt: 2, maxWidth: '100%', maxHeight: '300px', overflow: 'hidden' }}>
                  {files[0]?.type.startsWith("image") ? (
                    <img src={imagePreview} alt="Selected" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
                  ) : (
                    <video
                      src={imagePreview}
                      controls
                      style={{ width: '100%', height: 'auto', maxHeight: '300px', borderRadius: '4px' }}
                    />
                  )}
                </Box>
              )}
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <IconButton onClick={() => setNextStep(false)}><ArrowBackIcon /></IconButton>
                <Typography variant="h6">Create a Post</Typography>
                <Button variant="contained" color="primary" onClick={handleShare} disabled={loading}>
                  {loading ? "Sharing..." : "Share"}
                </Button>
              </Box>
              <Box className="cptn-otr">
                <Box className="capimg" sx={{ width: '100%' }}>
                  {files[0]?.type.startsWith("image") ? (
                    <img src={imagePreview} alt="Selected" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
                  ) : (
                    <video src={imagePreview} controls style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
                  )}
                </Box>
                <Box className="cption" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <TextField className="txtcp" label="Caption" multiline variant="outlined" value={caption} onChange={(e) => setCaption(e.target.value)} fullWidth />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Confirmation Modal for Discard */}
      <Modal open={confirmOpen} onClose={handleCancel}>
        <Box sx={{ padding: 3, textAlign: 'center', bgcolor: 'white', borderRadius: '8px', boxShadow: 3, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px' }}>
          <Typography variant="h6">Discard Post?</Typography>
          <Typography variant="body2" sx={{ margin: '16px 0' }}>If you leave, your edits won't be saved.</Typography>
          <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleDiscard} sx={{ marginLeft: 2 }}>Discard</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default UploadModal;
