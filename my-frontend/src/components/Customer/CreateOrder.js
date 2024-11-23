import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomerLayout.css'; // Ensure correct path

function CreateOrder() {
  const [productId, setProductId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authorization token is missing. Please log in again.');
        return;
      }
      await axios.post('http://localhost:5000/create_order', {
        product_id: productId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Error creating order: ${error.response?.data?.message || 'Internal Server Error'}`);
    }
  };

  return (
    <div className="customer-container">
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <label>Product ID:</label>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        />
        <button type="submit">Create Order</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default CreateOrder;
