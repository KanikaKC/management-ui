import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Settings.css'; 

// Import your default user SVG image
import DefaultUserImage from './Assets/user-profile.png'; // Adjust the path as needed

const Settings = () => {
  const [userDetails, setUserDetails] = useState({
    username: 'GUEST', // Default username
    profilePic: DefaultUserImage, // Default profile picture
  });
  const navigate = useNavigate(); // Hook to navigate between routes

  useEffect(() => {
    const updateUserDetails = () => {
      const storedUsername = sessionStorage.getItem('username') || 'GUEST';
      const storedProfilePic = sessionStorage.getItem('profilePic');

      setUserDetails({
        username: storedUsername,
        profilePic: storedProfilePic ? `data:image/png;base64,${storedProfilePic}` : DefaultUserImage, // Use default if null
      });
    };

    // Update user details initially
    updateUserDetails();

    // Set an event listener to update on storage change
    window.addEventListener('storage', updateUserDetails);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('storage', updateUserDetails);
    };
  }, []);

  const handleClose = () => {
    navigate('/app/add-expense'); // Adjust this path as needed
  };

  return (
    <div className="settings-container">
      <span style={{ marginLeft: '50%' }}>Settings</span>
      <button className="btn-close" style={{ marginLeft: '38%' }} onClick={handleClose}>
        &times; {/* Close button as an "X" */}
      </button>      
      <hr className="separator" />
      <div className="navbar"> 
        <ul className="nav column">
          <li className="nav-item-settings">
            <NavLink
              to="/app/settings/profile" 
              className={({ isActive }) => `nav-link text-dark rounded-0 ${isActive ? 'bg-skyblue' : ''}`} >
              <div className="user-info">
                <img 
                  src={userDetails.profilePic} 
                  alt="User Profile" 
                  className="profile-pic" 
                  onError={(e) => { e.target.onerror = null; e.target.src = DefaultUserImage; }} // Fallback to default if error
                />
                <div className="user-details">
                  <span className="user-account">User Account</span>
                  <span className="username">{userDetails.username.toUpperCase()}</span>
                </div>
              </div>
            </NavLink>
          </li>
          <li className="nav-item-settings">
            <NavLink
              to="/app/settings/appearance"
              className={({ isActive }) => `nav-link text-dark rounded-0 padding ${isActive ? 'bg-skyblue' : ''}`}>
              <i className="bi bi-brightness-high me-2"></i>
              Appearance
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
