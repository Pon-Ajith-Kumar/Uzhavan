import React from 'react';
import { Link } from 'react-router-dom';
import './CustomerLayout.css'; // Use the same CSS file

function CustomerVerticalNavbar() {
  return (
    <nav className="customer-vertical-nav">
      <ul>
        <li><Link to="/customer/profile">View Profile</Link></li>
        <li><Link to="/customer/uzhavan-store-c">Uzhavan Store C</Link></li> {/* Link for Uzhavan Store C */}
        <li><Link to="/customer/view-orders">View Orders</Link></li>
        <li><Link to="/customer/view-purchase-requests">View Purchase Requests</Link></li>
        <li><Link to="/customer/view-billing-reports">View Billing Reports</Link></li>
      </ul>
    </nav>
  );
}

export default CustomerVerticalNavbar;
