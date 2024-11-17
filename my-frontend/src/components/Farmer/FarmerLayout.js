import React from 'react';
import { Outlet } from 'react-router-dom';
import FarmerNavbar from './FarmerNavbar'; // Import the new FarmerNavbar
import FarmerVerticalNavbar from './FarmerVerticalNavbar'; // Import the vertical FarmerNavbar
import './FarmerLayout.css'; // Ensure you have this CSS file for styling

function FarmerLayout() {
  const farmerName = localStorage.getItem('username'); // Retrieve username from local storage

  return (
    <div className="farmer-container">
      <FarmerNavbar farmerName={farmerName} />
      <div className="main-layout">
        <FarmerVerticalNavbar /> {/* Vertical Navbar */}
        <main className="farmer-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default FarmerLayout;
