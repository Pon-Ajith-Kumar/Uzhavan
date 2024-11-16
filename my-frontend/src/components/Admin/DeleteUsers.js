import React from 'react';
import axios from 'axios';

function DeleteUsers() {
  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:5000/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        withCredentials: true
      });
      alert('All users deleted and auto-increment reset successfully');
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  return (
    <div>
      <h2>Delete All Users</h2>
      <button onClick={handleDelete}>Delete Users</button>
    </div>
  );
}

export default DeleteUsers;
