import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import Navbar from './Navbar'; 
import './Register.css';
import registerImage from '../assets/images/register-image.jpg'; 
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    role: '',
    username: '',
    password: '',
    email: '',
    contact: '',
    country: '',
    state: '',
    district: '',
    taluk: '',
    address: '',
    pincode: '',
    account_no: '',
    account_holder_name: '', // Add this field
    bank_name: '',
    branch_name: '',
    ifsc_code: '',
  });

  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false); // New state for login button visibility
  const messageRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selectedOption) => {
    setFormData({ ...formData, country: selectedOption.value, state: '', district: '', taluk: '' });
  };

  const handleStateChange = (selectedOption) => {
    setFormData({ ...formData, state: selectedOption.value, district: '', taluk: '' });
  };

  const handleDistrictChange = (selectedOption) => {
    setFormData({ ...formData, district: selectedOption.value, taluk: '' });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContact = (contact) => {
    const contactRegex = /^\d{10}$/; // Assuming a 10-digit contact number
    return contactRegex.test(contact);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setMessage(`UZHAVAN SAYS\nPlease enter a valid email address.`);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!validateContact(formData.contact)) {
      setMessage(`UZHAVAN SAYS\nPlease enter a valid contact number.`);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000);
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    for (const field in formData) {
      if (!formData[field]) {
        setMessage(`UZHAVAN SAYS\nPlease fill in the ${field.replace('_', ' ')} field.`);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 5000); // Hide the message after 5 seconds
        if (messageRef.current) {
          messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      setMessage(`UZHAVAN SAYS\n${response.data.message}`);
      setShowMessage(true);
      setShowLoginButton(true); // Show the login button on successful registration
      setTimeout(() => setShowMessage(false), 5000); // Hide the message after 5 seconds
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(`UZHAVAN SAYS\n${error.response?.data?.message || 'Registration failed. Please try again later.'}`);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 5000); // Hide the message after 5 seconds
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  useEffect(() => {
    if (!showMessage) {
      setMessage('');
    }
  }, [showMessage]);

  const countries = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  const states = formData.country
    ? State.getStatesOfCountry(formData.country).map((state) => ({
        label: state.name,
        value: state.isoCode,
      }))
    : [];

  const districts = formData.state
    ? City.getCitiesOfState(formData.country, formData.state).map((city) => ({
        label: city.name,
        value: city.name,
      }))
    : [];

  return (
    <>
      <Navbar /> {/* Render the Navbar component here */}
      <div className="register-wrapper">
        <div className="register-image">
          <img src={registerImage} alt="Register Illustration" />
          {showMessage && (
            <div className="popup-message" ref={messageRef}>
              <p>{message}</p>
            </div>
          )}
        </div>
        <div className="register-container">
          <h2>Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Step 1: Basic Information</h3>
              <label>
                <b>Role</b>
                <select name="role" value={formData.role} onChange={handleChange} required>
                  <option value="">Select Role</option>
                  <option value="customer">Customer</option>
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label>
                <b>Username</b>
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
              </label>
              <label>
                <b>Password</b>
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              </label>
              <label>
                <b>Email</b>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              </label>
              <label>
                <b>Contact</b>
                <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />
              </label>
            </div>
            
            <div className="form-section">
              <h3>Step 2: Location Information</h3>
              <label>
                <b>Country</b>
                <Select options={countries} onChange={handleCountryChange} value={countries.find((country) => country.value === formData.country)} />
              </label>
              <label>
                <b>State</b>
                <Select options={states} onChange={handleStateChange} value={states.find((state) => state.value === formData.state)} />
              </label>
              <label>
                <b>District</b>
                <Select options={districts} onChange={handleDistrictChange} value={districts.find((district) => district.value === formData.district)} />
              </label>
              <label>
                <b>Taluk</b>
                <input type="text" name="taluk" placeholder="Taluk" value={formData.taluk} onChange={handleChange} required />
              </label>
              <label>
                <b>Address</b>
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
              </label>
              <label>
                <b>Pincode</b>
                <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
              </label>
            </div>

            <div className="form-section">
              <h3>Step 3: Bank Information</h3>
              <label>
                <b>Account Number</b>
                <input type="text" name="account_no" placeholder="Account Number" value={formData.account_no} onChange={handleChange} required />
              </label>
              <label>
                <b>Account Holder Name</b> {/* New field */}
                <input type="text" name="account_holder_name" placeholder="Account Holder Name" value={formData.account_holder_name} onChange={handleChange} required />
              </label>
              <label>
                <b>Bank Name</b>
                <input type="text" name="bank_name" placeholder="Bank Name" value={formData.bank_name} onChange={handleChange} required />
              </label>
              <label>
                <b>Branch Name</b>
                <input type="text" name="branch_name" placeholder="Branch Name" value={formData.branch_name} onChange={handleChange} required />
              </label>
              <label>
                <b>IFSC Code</b>
                <input type="text" name="ifsc_code" placeholder="IFSC Code" value={formData.ifsc_code} onChange={handleChange} required />
              </label>
            </div>
            
            <button type="submit">Register</button>
          </form>
          {showLoginButton && (
            <button className="login-button" onClick={() => navigate('/login')}>
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Register;
