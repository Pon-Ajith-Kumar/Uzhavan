import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './FarmerProfile.css';

function FarmerViewProfile() {
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
      .then(() => {
        setEditMode(false);
        toast.success('Profile updated successfully!');
        fetchProfile();
      })
      .catch(() => {
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
      .catch(() => {
        toast.error('Failed to change password.');
      });
  };

  return (
    <div className="view-profile">
      <ToastContainer />
      <div className="card">
        <div className="card-header">
          <h2>Farmer Profile</h2>
        </div>
        <div className="card-body">
          <p>
            <label>Username</label> {profile.username || 'Loading...'}
          </p>
          <p>
            <label>Email</label> {profile.email || 'Loading...'}
          </p>
          <p>
            <label>Contact</label> {profile.contact || 'Loading...'}
          </p>
          <p>
            <label>Country</label> {profile.country || 'Loading...'}
          </p>
          <p>
            <label>State</label> {profile.state || 'Loading...'}
          </p>
          <p>
            <label>District</label> {profile.district || 'Loading...'}
          </p>
          <p>
            <label>Taluk</label> {profile.taluk || 'Loading...'}
          </p>
          <p>
            <label>Address</label> {profile.address || 'Loading...'}
          </p>
          <p>
            <label>Pincode</label> {profile.pincode || 'Loading...'}
          </p>
          <p>
            <label>Account Number</label> {profile.account_no || 'Loading...'}
          </p>
          <p>
            <label>Account Holder Name</label> {profile.account_holder_name || 'Loading...'}
          </p>
          <p>
            <label>Bank Name</label> {profile.bank_name || 'Loading...'}
          </p>
          <p>
            <label>Branch Name</label> {profile.branch_name || 'Loading...'}
          </p>
          <p>
            <label>IFSC Code</label> {profile.ifsc_code || 'Loading...'}
          </p>
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
                <label>{key.replace(/_/g, ' ').toUpperCase()}:</label>
                <input
                  type="text"
                  name={key}
                  value={profile[key] || ''}
                  onChange={handleProfileChange}
                />
              </div>
            ))}
            <div className="card-actions">
              <button onClick={updateProfile} className="action-button">
                Update Profile
              </button>
              <button onClick={() => setEditMode(false)} className="action-button cancel-button">
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
              <label>Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="card-actions">
              <button onClick={changePassword} className="action-button">
                Change Password
              </button>
              <button onClick={() => setPasswordChangeMode(false)} className="action-button cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FarmerViewProfile;
