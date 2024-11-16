import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/logo.png'; // Adjust the path if necessary
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout'); // Call the logout route
      // Redirect to home or login page after logout
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleRedirectHome = () => {
    navigate('/'); // Redirect to the home page
  };

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li>
          <Link to="/" className="logo-link">
            <img src={logo} alt="Uzhavan Logo" className="logo" />
            <span className="logo-text" onClick={handleRedirectHome}>உழவன்</span>
          </Link>
        </li>
        <li><Link to="/register" className="nav-links button-link">Register</Link></li>
        <li><Link to="/login" className="nav-links button-link">Login</Link></li>
        <li><button onClick={handleLogout} className="nav-links button-link signout-button">Sign Out</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
