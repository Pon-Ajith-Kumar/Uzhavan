import React from 'react';
import { Link } from 'react-router-dom';
import './CustomerLayout.css'; // Use the same CSS file

function CustomerVerticalNavbar() {
  return (
    <nav className="customer-vertical-nav">
      <ul>
        <li><Link to="/customer/profile">View Profile</Link></li>
        <li><Link to="/customer/create-order">Create Order</Link></li>
        <li><Link to="/customer/view-orders">View Orders</Link></li>
        <li><Link to="/customer/view-purchase-requests">View Purchase Requests</Link></li>
        <li><Link to="/customer/view-billing-reports">View Billing Reports</Link></li>
        <li><Link to="/customer/track-order-status">Track Order Status</Link></li>
        <li><Link to="/customer/cancel-order">Cancel Order</Link></li>
      </ul>
    </nav>
  );
}

export default CustomerVerticalNavbar;
