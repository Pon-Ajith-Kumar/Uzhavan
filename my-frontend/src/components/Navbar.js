// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/logo.png'; // Adjust the path if necessary

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/"><img src={logo} alt="Uzhavan Logo" className="logo" /></Link>
        </li>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
