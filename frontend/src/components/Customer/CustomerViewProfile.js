import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomerProfile.css';

function CustomerViewProfile() {
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
          <h2>Customer Profile</h2>
        </div>
        <div className="card-body">
          <p><span>Username</span> {profile.username || 'customeruser'}</p>
          <p><span>Email</span> {profile.email || 'newuser@example.com'}</p>
          <p><span>Contact</span> {profile.contact || '1234567899'}</p>
          <p><span>Country</span> {profile.country || 'CountryName'}</p>
          <p><span>State</span> {profile.state || 'StateName'}</p>
          <p><span>District</span> {profile.district || 'DistrictName'}</p>
          <p><span>Taluk</span> {profile.taluk || 'TalukName'}</p>
          <p><span>Address</span> {profile.address || '123 Main St, Anytown'}</p>
          <p><span>Pincode</span> {profile.pincode || '12345'}</p>
          <p><span>Account Number</span> {profile.account_no || '123456789012'}</p>
          <p><span>Account Holder Name</span> {profile.account_holder_name || 'Abc'}</p>
          <p><span>Bank Name</span> {profile.bank_name || 'Bank Name'}</p>
          <p><span>Branch Name</span> {profile.branch_name || 'Branch Name'}</p>
          <p><span>IFSC Code</span> {profile.ifsc_code || 'IFSC1234'}</p>
        </div>
        <div className="card-actions">
          <button className="action-button" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
          <button className="action-button" onClick={() => setPasswordChangeMode(true)}>
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
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={profile.username || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profile.email || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Contact:</label>
              <input
                type="text"
                name="contact"
                value={profile.contact || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={profile.country || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={profile.state || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>District:</label>
              <input
                type="text"
                name="district"
                value={profile.district || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Taluk:</label>
              <input
                type="text"
                name="taluk"
                value={profile.taluk || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={profile.address || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Pincode:</label>
              <input
                type="text"
                name="pincode"
                value={profile.pincode || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Account Number:</label>
              <input
                type="text"
                name="account_no"
                value={profile.account_no || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Account Holder Name:</label>
              <input
                type="text"
                name="account_holder_name"
                value={profile.account_holder_name || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Bank Name:</label>
              <input
                type="text"
                name="bank_name"
                value={profile.bank_name || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>Branch Name:</label>
              <input
                type="text"
                name="branch_name"
                value={profile.branch_name || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-group">
              <label>IFSC Code:</label>
              <input
                type="text"
                name="ifsc_code"
                value={profile.ifsc_code || ''}
                onChange={handleProfileChange}
              />
            </div>
            <div className="card-actions">
              <button className="action-button" onClick={updateProfile}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={() => setEditMode(false)}>
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
            <div className="card-actions">
              <button className="action-button" onClick={changePassword}>
                Change Password
              </button>
              <button className="cancel-button" onClick={() => setPasswordChangeMode(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerViewProfile;
