import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrashAlt } from 'react-icons/fa'; // Import trash icon
import Modal from 'react-modal'; // Import Modal
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ViewUsers.css'; // Import the CSS file

Modal.setAppElement('#root'); // This is important for screen readers

function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteAllModalIsOpen, setDeleteAllModalIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

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

  const openModal = (userId) => {
    setUserToDelete(userId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setUserToDelete(null);
  };

  const openDeleteAllModal = () => {
    setDeleteAllModalIsOpen(true);
  };

  const closeDeleteAllModal = () => {
    setDeleteAllModalIsOpen(false);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`http://localhost:5000/admin/users/${userToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          },
          withCredentials: true
        });
        setUsers(users.filter(user => user.id !== userToDelete)); // Remove the deleted user from the list
        toast.success('User deleted successfully');
        closeModal();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user.');
        closeModal();
      }
    }
  };

  const handleDeleteAllUsers = async () => {
    try {
      await axios.delete('http://localhost:5000/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        withCredentials: true
      });
      setUsers([]); // Clear users list after deletion
      toast.success('All users deleted and auto-increment reset successfully');
      closeDeleteAllModal();
      navigate('/'); // Navigate to the home page after deletion
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error('Failed to delete all users.');
      closeDeleteAllModal();
    }
  };

  return (
    <div className="view-users">
      <ToastContainer />
      <h2>Users List</h2>
      <div className="delete-all-container">
        <button onClick={openDeleteAllModal} className="delete-button">Delete All Users</button>
      </div>

      <div className="users-section">
        <h3>Admins</h3>
        <ul className="users-list">
          {users.filter(user => user.role === 'admin').map(user => (
            <li key={user.id}>
              {user.username}
              <FaTrashAlt onClick={() => openModal(user.id)} className="delete-icon" />
            </li>
          ))}
        </ul>
      </div>

      <div className="users-section">
        <h3>Farmers</h3>
        <ul className="users-list">
          {users.filter(user => user.role === 'farmer').map(user => (
            <li key={user.id}>
              {user.username}
              <FaTrashAlt onClick={() => openModal(user.id)} className="delete-icon" />
            </li>
          ))}
        </ul>
      </div>

      <div className="users-section">
        <h3>Customers</h3>
        <ul className="users-list">
          {users.filter(user => user.role === 'customer').map(user => (
            <li key={user.id}>
              {user.username}
              <FaTrashAlt onClick={() => openModal(user.id)} className="delete-icon" />
            </li>
          ))}
        </ul>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this user?</p>
        <button onClick={handleDeleteUser} className="action-button">Yes</button>
        <button onClick={closeModal} className="cancel-button">No</button>
      </Modal>

      <Modal
        isOpen={deleteAllModalIsOpen}
        onRequestClose={closeDeleteAllModal}
        contentLabel="Confirm Delete All"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Confirm Delete All</h2>
        <p>Are you sure you want to delete all users?</p>
        <button onClick={handleDeleteAllUsers} className="action-button">Yes</button>
        <button onClick={closeDeleteAllModal} className="cancel-button">No</button>
      </Modal>
    </div>
  );
}

export default ViewUsers;
