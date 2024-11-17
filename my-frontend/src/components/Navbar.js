import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/logo.png'; // Adjust the path if necessary

function Navbar() {
  const navigate = useNavigate();

  const handleRedirectHome = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li className="logo-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Uzhavan Logo" className="logo" />
            <span className="logo-text" onClick={handleRedirectHome}>உழவன்</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
