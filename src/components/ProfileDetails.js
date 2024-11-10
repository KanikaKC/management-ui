import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileDetails.css'; 

const defaultUserImage = '../components/Assets/user-profile.png'; // Path to your default image

const ProfileDetails = () => {
  const [localDetails, setLocalDetails] = useState({});
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const email = sessionStorage.getItem('emailId') || '';

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedProfilePic = localStorage.getItem('profilePic') || defaultUserImage;

    const initialDetails = {
      username: storedUsername || '',
      profilePic: storedProfilePic, // Use stored profile pic or default
    };

    setLocalDetails(initialDetails);

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user/details/${email}`);
        const userData = response.data.data;

        // If the server response has a profile picture, use it; otherwise, use the stored one
        setLocalDetails(prevDetails => ({
          ...prevDetails,
          ...userData,
          profilePic: userData.profilePic || initialDetails.profilePic,
        }));
      } catch (err) {
        setError(err.response ? err.response.data.message : "An error occurred while fetching user details.");
      }
    };

    if (email) {
      fetchUserDetails();
    }
  }, [email]);

  const handleEditClick = () => {
    // Reset the selected file when opening the modal to avoid confusion
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      const updatedUserDetailsDto = {
        username: localDetails.username,
        emailId: localDetails.emailId,
        phoneNumber: localDetails.phoneNumber,
        address: localDetails.address,
      };

      formData.append('userDetails', new Blob([JSON.stringify(updatedUserDetailsDto)], { type: 'application/json' }));

      // Only append the file if a new one is selected
      if (selectedFile) {
        formData.append('profilePic', selectedFile);
      }

      const response = await axios.put(`http://localhost:8000/user/update/${email}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        const updatedDetails = {
          ...localDetails,
          profilePic: selectedFile ? URL.createObjectURL(selectedFile) : localDetails.profilePic, // Retain old pic if no new file
        };
        setLocalDetails(updatedDetails);

        // Update session and local storage
        sessionStorage.setItem('profilePic', updatedDetails.profilePic);
        localStorage.setItem('profilePic', updatedDetails.profilePic);

        setIsModalOpen(false);
      } else {
        setError(response.data.message || "An error occurred while saving changes.");
      }
    } catch (err) {
      setError("An error occurred while saving changes.");
    }
  };

  const handleCancel = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setLocalDetails({
      ...localDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalDetails(prevDetails => ({
          ...prevDetails,
          profilePic: reader.result.split(',')[1], // Base64 string for immediate preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-details">
      <div className="d-flex align-items-center mb-5">
        <div className="profile-pic-visible me-2">
          <img 
            src={localDetails.profilePic ? `data:image/jpeg;base64,${localDetails.profilePic}` : defaultUserImage} 
            alt="Profile" 
            className="rounded-circle" 
            width="70"  
            height="70" 
          />
          <span className="username-profile mb-0" style={{ marginLeft: '20px' }}>
            {localDetails.username ? localDetails.username.toUpperCase() : 'GUEST'}
          </span>
        </div>
        <button className="btn btn-light mt-1" onClick={handleEditClick}>
          <i className="bi bi-pencil"></i> Edit
        </button>
      </div>
      <div className="profile-info">
        <div className="mb-2"><strong>Email:</strong> {localDetails.emailId}</div>
        <div className="mb-2"><strong>Phone Number:</strong> {localDetails.phoneNumber}</div>
        <div className="mb-2"><strong>Address:</strong> {localDetails.address}</div>
      </div>
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content rounded-border">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-2">
                  <div className="col-4">
                    <label><strong>Full Name:</strong></label>
                  </div>
                  <div className="col-8">
                    <input type="text" name="username" value={localDetails.username || ''} onChange={handleChange} className="form-control rounded-field" />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-4">
                    <label><strong>Email:</strong></label>
                  </div>
                  <div className="col-8">
                    <input type="email" name="emailId" value={localDetails.emailId || ''} onChange={handleChange} className="form-control rounded-field" />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-4">
                    <label><strong>Phone Number:</strong></label>
                  </div>
                  <div className="col-8">
                    <input type="text" name="phoneNumber" value={localDetails.phoneNumber || ''} onChange={handleChange} className="form-control rounded-field" />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-4">
                    <label><strong>Address:</strong></label>
                  </div>
                  <div className="col-8">
                    <input type="text" name="address" value={localDetails.address || ''} onChange={handleChange} className="form-control rounded-field" />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-4">
                    <label><strong>Profile Picture:</strong></label>
                  </div>
                  <div className="col-8">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="form-control rounded-field" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSave}>Update</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
