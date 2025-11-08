import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar'; // Import the new AdminNavbar
import AdminVerticalNavbar from './AdminVerticalNavbar'; // Import the vertical AdminNavbar
import './AdminLayout.css'; // Ensure you have this CSS file for styling

function AdminLayout() {
  const adminName = localStorage.getItem('username'); // Retrieve username from local storage

  return (
    <div className="admin-container">
      <AdminNavbar adminName={adminName} />
      <div className="main-layout">
        <AdminVerticalNavbar /> {/* Vertical Navbar */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
