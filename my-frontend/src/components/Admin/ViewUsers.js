import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewUsers.css'; // Import the CSS file

function ViewUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          },
          withCredentials: true
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteAllUsers = async () => {
    try {
      await axios.delete('http://localhost:5000/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        withCredentials: true
      });
      setUsers([]); // Clear users list after deletion
      alert('All users deleted and auto-increment reset successfully');
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  return (
    <div>
      <h2>Users List</h2>
      <button onClick={handleDeleteAllUsers} className="delete-button">Delete All Users</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
}

export default ViewUsers;
