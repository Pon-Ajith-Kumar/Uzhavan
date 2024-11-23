import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerNavbar from './CustomerNavbar'; 
import CustomerVerticalNavbar from './CustomerVerticalNavbar'; 
import './CustomerLayout.css'; 

function CustomerLayout() {
  return (
    <div className="customer-container">
      <CustomerNavbar />
      <div className="main-layout">
        <CustomerVerticalNavbar />
        <main className="customer-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
