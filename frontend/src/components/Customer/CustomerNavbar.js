import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerLayout.css'; // Ensure this path is correct

function CustomerNavbar() {
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
    <nav className="customer-navbar">
      <div className="navbar-content">
        <div className="customer-info">
          <i className="fas fa-user customer-icon"></i> {/* Font Awesome Icon for Customer */}
          <span className="customer-title">Customer</span> {/* Display "Customer" text */}
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

export default CustomerNavbar;
