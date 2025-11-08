// src/components/Footer.js
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/register">Register</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p><i className="fas fa-envelope"></i> <strong>Email:</strong> <a href="mailto:uzhavanservices@gmail.com">uzhavanservices@gmail.com</a></p>
          <p><i className="fas fa-phone"></i> <strong>Phone:</strong> +91 8489968755</p>
          <p><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> CEG, AU, Chennai, India</p>
        </div>
        <div className="footer-section social-media">
          <h3 className="center-text">Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Uzhavan. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;