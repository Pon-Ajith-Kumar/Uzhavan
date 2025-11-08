import React, { useState } from 'react';
import axios from 'axios';
import './CustomerLayout.css'; // Ensure correct path

function CancelOrder() {
  const [orderId, setOrderId] = useState('');

  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:5000/orders/cancel', { order_id: orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order');
    }
  };

  return (
    <div className="customer-container">
      <h2>Cancel Order</h2>
      <input
        type="text"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
      />
      <button onClick={handleCancelOrder}>Cancel Order</button>
    </div>
  );
}

export default CancelOrder;
