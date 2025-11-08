import React from 'react';
import { Link } from 'react-router-dom';
import './AdminNavbar.css'; // Use the same CSS file

function AdminVerticalNavbar() {
  return (
    <nav className="admin-vertical-nav">
      <ul>
        <li><Link to="/admin/profile">View Profile</Link></li> {/* Add View Profile option */}
        <li><Link to="/admin/users">View Users</Link></li>
        <li><Link to="/admin/products">View Products</Link></li>
        <li><Link to="/admin/orders">View Orders</Link></li>
        <li><Link to="/admin/purchase-requests">View Purchase Requests</Link></li>
        <li><Link to="/admin/billing-report">View Billing Reports</Link></li>
      </ul>
    </nav>
  );
}

export default AdminVerticalNavbar;
