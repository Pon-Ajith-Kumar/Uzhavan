import React, { useState } from 'react';
import axios from 'axios';
import './CustomerLayout.css'; // Ensure correct path

function CreateOrder() {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:5000/create_order', {
        product_id: productId,
        quantity: quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
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
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button type="submit">Create Order</button>
      </form>
    </div>
  );
}

export default CreateOrder;
