import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminProfile.css'; // Ensure you have a separate CSS file for styling the admin's profile

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
    axios
      .get('http://localhost:5000/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const updateProfile = () => {
    axios
      .put('http://localhost:5000/profile', profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data);
        setEditMode(false);
        toast.success('Profile updated successfully!');
        fetchProfile();
      })
      .catch((error) => {
        toast.error('Failed to update profile.');
      });
  };

  const changePassword = () => {
    axios
      .put(
        'http://localhost:5000/change_password',
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then(() => {
        setPasswordChangeMode(false);
        setOldPassword('');
        setNewPassword('');
        toast.success('Password changed successfully!');
      })
      .catch((error) => {
        toast.error('Failed to change password.');
      });
  };

  return (
    <div className="admin-content">
      <ToastContainer />
      <div className="card">
        <div className="card-header">
          <h2>Profile Details</h2>
        </div>
        <div className="card-body">
          {Object.keys(profile).map((key) => (
            <p key={key}>
              <label>{key.replace('_', ' ').toUpperCase()}</label> {profile[key] || 'Loading...'}
            </p>
          ))}
        </div>
        <div className="card-actions">
          <button onClick={() => setEditMode(true)} className="action-button">
            Edit Profile
          </button>
          <button onClick={() => setPasswordChangeMode(true)} className="action-button">
            Change Password
          </button>
        </div>
      </div>
      {editMode && (
        <div className="card">
          <div className="card-header">
            <h2>Edit Profile</h2>
          </div>
          <div className="card-body">
            {Object.keys(profile).map((key) => (
              <div className="form-group" key={key}>
                <label>{key.replace('_', ' ').toUpperCase()}:</label>
                <input
                  type="text"
                  name={key}
                  value={profile[key] || ''}
                  onChange={handleProfileChange}
                />
              </div>
            ))}
            <div className="card-actions-center">
              <button onClick={updateProfile} className="action-button">
                Update Profile
              </button>
              <button onClick={() => setEditMode(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {passwordChangeMode && (
        <div className="card">
          <div className="card-header">
            <h2>Change Password</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Old Password:</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="card-actions-center">
              <button onClick={changePassword} className="action-button">
                Change Password
              </button>
              <button onClick={() => setPasswordChangeMode(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProfile;
