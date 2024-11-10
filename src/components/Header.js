import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ribbon from '../components/Assets/header_ribbon.png';
import logo from '../components/Assets/bosch_logo.png';
import './Header.css';
import defaultUser from '../components/Assets/user-profile.png'; // Default image
import userIcon from '../components/Assets/user.svg'; // User icon for logout button
import Cookies from 'js-cookie';

const Header = ({ showLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImageSrc, setProfileImageSrc] = useState(defaultUser);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Get user details from sessionStorage
  const getUserDetailsFromSession = () => {
    const username = sessionStorage.getItem('username');
    const profilePic = sessionStorage.getItem('profilePic'); // Assuming profilePic is stored as a base64 string
    return { username, profilePic };
  };

  const { username, profilePic } = getUserDetailsFromSession();

  useEffect(() => {
    // Set profile image source based on profile picture or default image
    if (profilePic && profilePic.trim() !== '') {
      setProfileImageSrc(`data:image/png;base64,${profilePic}`);
    } else {
      setProfileImageSrc(defaultUser);
    }
  }, [profilePic]);

  const handleLogout = async () => {
    sessionStorage.clear(); 
    sessionStorage.removeItem(profilePic)// Clear all session data
    Cookies.remove('logged_in');
    Cookies.remove('JSESSIONID');
    Cookies.remove('auth_token');
    Cookies.set('logged_in', 'false');
    console.log("Removing auth_token cookie");

    navigate("/", { replace: true }); // Redirect to home page after logout
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSettings = () => {
    navigate("/app/settings");
  };

  // Add event listener to close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  if (!showLogout) return null;

  return (
    <div className="header">
      <img className="ribbon" src={ribbon} alt="Header Ribbon" />
      <div className="logo-container">
        <img className="logo" src={logo} alt="Logo" />

        {showLogout && (
          <div className="profile-container" onClick={toggleMenu}>
            <img
              className="profile-pic-header"
              src={profileImageSrc}
              alt="Profile"
              onError={() => setProfileImageSrc(defaultUser)} // Fallback on error
            />
          </div>
        )}

        {menuOpen && showLogout && (
          <div ref={menuRef} className="hamburger-menu">
            <div className="menu-item username-item">
              <span className="username">{username || 'Guest'}</span>
            </div>
            <div className="menu-item">
              <button onClick={handleSettings} className="settings-button d-flex align-items-center">
                <i className="bi bi-gear-fill me-2"></i>
                <span className="settings-label">Settings</span>
              </button>
            </div>
            <hr className="menu-separator" />
            <div className="menu-item">
              <button onClick={handleLogout} className="logout-button d-flex align-items-center">
                <img
                  src={userIcon}
                  alt="User Icon"
                  className="logout-icon me-1"
                  style={{ width: '23px', height: '19px' }}
                />
                <span className="logout-label">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
