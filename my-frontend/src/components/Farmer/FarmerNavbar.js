import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FarmerNavbar.css'; // Ensure this path is correct

function FarmerNavbar() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username'); // Remove username on sign out
    setShowPopup(true);
    setTimeout(() => {
      console.log('Signed out'); // Log out message
      navigate('/'); // Navigate to the home page
    }, 1000); // Show popup for 1 second
  };

  return (
    <nav className="farmer-navbar">
      <div className="navbar-content">
        <div className="farmer-info">
          <i className="fas fa-tractor farmer-icon"></i> {/* Font Awesome Icon for Farmer */}
          <span className="farmer-title">Farmer</span> {/* Display "Farmer" text */}
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

export default FarmerNavbar;
