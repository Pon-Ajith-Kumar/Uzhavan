import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/images/logo.png';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('username', response.data.user.name); // Store username
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', JSON.stringify(formData));
      } else {
        localStorage.removeItem('rememberMe');
      }
      const userRole = response.data.user.role;
      // Navigate based on user role
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'farmer') {
        navigate('/farmer');
      } else if (userRole === 'customer') {
        navigate('/customer'); // Redirect customers to the customer dashboard
      }
    } catch (error) {
      setError('Invalid Credentials');
    }
  };

  useEffect(() => {
    const rememberedData = JSON.parse(localStorage.getItem('rememberMe'));
    if (rememberedData) {
      setFormData(rememberedData);
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-form">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <i className="fas fa-user-tag"></i>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <label className="remember-me">
            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} /> Remember me
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="login-links">
          <a href="/register" className="register-link">New User? Register</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
