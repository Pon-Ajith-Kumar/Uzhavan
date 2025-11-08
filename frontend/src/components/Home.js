import React from 'react';
import './Home.css';
import heroImage from '../assets/images/hero.jpg';
import Navbar from './Navbar'; // Import Navbar component
import Footer from './Footer'; // Import Footer component

function Home() {
  return (
    <>
      <Navbar /> {/* Render the Navbar component here */}
      <div className="home">
        <div className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-content">
            <h1>Welcome to Uzhavan</h1>
            <p>Empowering farmers and connecting buyers. 
               Make agricultural trade simple, transparent, and efficient for everyone</p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => window.location.href = '/register'}>Register</button>
              <button className="btn btn-secondary" onClick={() => window.location.href = '/login'}>Login</button>
              <button className="btn btn-store" onClick={() => window.location.href = '/products'}>Uzhavan Store</button> {/* Add Uzhavan Store button */}
            </div>
          </div>
        </div>
        <div className="features">
          <h2>Our Features</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>Easy Product Listings</h3>
              <p>Quickly list your products and reach a wider audience.</p>
            </div>
            <div className="feature-card">
              <h3>Easy Order Management</h3>
              <p>Efficiently manage your orders with our intuitive platform.</p>
            </div>
            <div className="feature-card">
              <h3>Comprehensive Analytics</h3>
              <p>Get insights and analytics to grow your business.</p>
            </div>
          </div>
        </div>
        <div className="testimonials">
          <h2>What Our Users Say</h2>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <p>"Uzhavan has transformed the way we do agriculture. It's so easy to use!"</p>
              <h4>- Farmer Murugesan</h4>
            </div>
            <div className="testimonial-card">
              <p>"The platform is incredibly intuitive and helps us manage our operations efficiently."</p>
              <h4>- Farmer Ajith</h4>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Render the Footer component here */}
    </>
  );
}

export default Home;
