import React from 'react';
import { Link } from 'react-router-dom';
import './FarmerNavbar.css'; // Use the same CSS file

function FarmerVerticalNavbar() {
  return (
    <nav className="farmer-vertical-nav">
      <ul>
        <li><Link to="/farmer/profile">View Profile</Link></li>
        <li><Link to="/farmer/create_product">Create Product</Link></li>
        <li><Link to="/farmer/products">View Products</Link></li>
        <li><Link to="/farmer/orders">View Orders</Link></li>
      </ul>
    </nav>
  );
}

export default FarmerVerticalNavbar;
