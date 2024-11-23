import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminProfile.css'; // Ensure this path is correct

function ViewProfile() {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    axios.get('http://localhost:5000/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    .then(response => {
      console.log('Profile data fetched:', response.data); // Debug: Log profile data
      setProfile(response.data);
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
    });
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const updateProfile = () => {
    console.log('Attempting to update profile with:', profile); // Log the profile data before sending the request
    axios.put('http://localhost:5000/profile', profile, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    .then(response => {
      console.log('Profile updated successfully:', response.data); // Log the updated profile data
      setProfile(response.data); // Update the state with the new profile data
      setEditMode(false);
      toast.success('Profile updated successfully!'); // Show success message
      fetchProfile(); // Re-fetch profile data to ensure it's up-to-date
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Config data:', error.config);
      toast.error('Failed to update profile.'); // Show error message
    });
  };

  const changePassword = () => {
    axios.put('http://localhost:5000/change_password', { oldPassword, newPassword }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    .then(() => {
      setPasswordChangeMode(false);
      setOldPassword('');
      setNewPassword('');
      toast.success('Password changed successfully!'); // Show success message
    })
    .catch(error => {
      console.error('Error changing password:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Config data:', error.config);
      toast.error('Failed to change password.'); // Show error message
    });
  };

  return (
    <div className="view-profile">
      <ToastContainer />
      <h2>Admin Profile</h2>
      <div>
        <p>Username: {profile.username || 'Loading...'}</p>
        <p>Email: {profile.email || 'Loading...'}</p>
        <p>Contact: {profile.contact || 'Loading...'}</p>
        <p>Country: {profile.country || 'Loading...'}</p>
        <p>State: {profile.state || 'Loading...'}</p>
        <p>District: {profile.district || 'Loading...'}</p>
        <p>Taluk: {profile.taluk || 'Loading...'}</p>
        <p>Address: {profile.address || 'Loading...'}</p>
        <p>Pincode: {profile.pincode || 'Loading...'}</p>
        <p>Account Number: {profile.account_no || 'Loading...'}</p>
        <p>Account Holder Name: {profile.account_holder_name || 'Loading...'}</p>
        <p>Bank Name: {profile.bank_name || 'Loading...'}</p>
        <p>Branch Name: {profile.branch_name || 'Loading...'}</p>
        <p>IFSC Code: {profile.ifsc_code || 'Loading...'}</p>
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
        <button onClick={() => setPasswordChangeMode(true)}>Change Password</button>
      </div>

      {editMode && (
        <div>
          <label>
            Username:
            <input type="text" name="username" value={profile.username || ''} onChange={handleProfileChange} />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={profile.email || ''} onChange={handleProfileChange} />
          </label>
          <label>
            Contact:
            <input type="text" name="contact" value={profile.contact || ''} onChange={handleProfileChange} />
          </label>
          <label>
            Country:
            <input type="text" name="country" value={profile.country || ''} onChange={handleProfileChange} />
          </label>
          <label>
            State:
            <input type="text" name="state" value={profile.state || ''} onChange={handleProfileChange} />
          </label>
          <label>
            District:
            <input type="text" name="district" value={profile.district || ''} onChange={handleProfileChange} />
          </label>
          <label>
            Taluk:
            <input type="text" name="taluk" value={profile.taluk || ''} onChange={handleProfileChange} />
          </label>
          <label>
            Address:
            <input type="text" name="address" value={profile.address || ''} onChange={handleProfileChange} />
          </label>
          <label>
            Pincode:
            <input type="text" name="pincode" value={profile.pincode || ''} onChange={handleProfileChange} />
          </label>
          <label>
            Account Number:
            <input type="text" name="account_no" value={profile.account_no || ''} onChange={handleProfileChange} />
          </label>
          <label>
            Account Holder Name:
            <input type="text" name="account_holder_name" value={profile.account_holder_name || ''} onChange={handleProfileChange} />
          </label>
          <label>
            Bank Name:
            <input type="text" name="bank_name" value={profile.bank_name || ''} onChange={handleProfileChange} />
          </label>
          <label>
            Branch Name:
            <input type="text" name="branch_name" value={profile.branch_name || ''} onChange={handleProfileChange} />
          </label>
          <label>
            IFSC Code:
            <input type="text" name="ifsc_code" value={profile.ifsc_code || ''} onChange={handleProfileChange} />
          </label>
          <button onClick={updateProfile}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      )}

      {passwordChangeMode && (
        <div>
          <label>
            Old Password:
            <input type="password" name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </label>
          <label>
            New Password:
            <input type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>
          <button onClick={changePassword}>Change Password</button>
          <button onClick={() => setPasswordChangeMode(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default ViewProfile;
