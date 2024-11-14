// src/components/RoleSelection.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/register', { state: { role: selectedRole } });
    }
  };

  return (
    <div className="role-selection-container">
      <h2>Select Your Role</h2>
      <div className="role-buttons">
        <button onClick={() => handleRoleSelect('admin')}>Admin</button>
        <button onClick={() => handleRoleSelect('farmer')}>Farmer</button>
        <button onClick={() => handleRoleSelect('customer')}>Customer</button>
      </div>
      <button className="continue-button" onClick={handleContinue} disabled={!selectedRole}>
        Continue
      </button>
    </div>
  );
}

export default RoleSelection;
