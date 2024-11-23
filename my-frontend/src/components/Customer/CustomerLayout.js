import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from './CustomerNavbar'; // Import the new CustomerNavbar
import CustomerVerticalNavbar from './CustomerVerticalNavbar'; // Import the vertical CustomerNavbar
import './CustomerLayout.css'; // Ensure you have this CSS file for styling

function CustomerLayout() {
  const customerName = localStorage.getItem('username'); // Retrieve username from local storage

  return (
    <div className="customer-container">
      <CustomerNavbar customerName={customerName} />
      <div className="main-layout">
        <CustomerVerticalNavbar /> {/* Vertical Navbar */}
        <main className="customer-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
