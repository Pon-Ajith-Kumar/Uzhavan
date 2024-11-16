import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNavbar.css'; // Ensure this path is correct

function AdminNavbar() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username'); // Remove username on sign out
    setShowPopup(true);
    setTimeout(() => {
      console.log('Signed out'); // Log out message
      navigate('/'); // Navigate to the home page
    }, 1000); // Show popup for 0.5 seconds
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-content">
        <div className="admin-info">
          <i className="fas fa-user-shield admin-icon"></i> {/* Font Awesome Icon */}
          <span className="admin-title">Admin</span> {/* Display "Admin" text */}
        </div>
        <button onClick={handleSignOut} className="signout-button">Sign Out</button>
      </div>
      {showPopup && (
        <div className="popup-message">
          Signed Out Successfully
        </div>
      )}
    </nav>
  );
}

export default AdminNavbar;
