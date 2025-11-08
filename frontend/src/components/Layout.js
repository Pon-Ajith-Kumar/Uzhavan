// src/components/Layout.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="layout-container">
      {location.pathname !== '/' && <Navbar />}
      <div className="content">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
