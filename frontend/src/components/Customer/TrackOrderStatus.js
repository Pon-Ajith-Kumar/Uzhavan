import React, { useState } from 'react';
import axios from 'axios';
import './CustomerLayout.css'; // Ensure correct path

function TrackOrderStatus() {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const handleTrackOrder = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:5000/orders/status', { order_id: orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderStatus(response.data.order_status);
    } catch (error) {
      console.error('Error tracking order status:', error);
      setOrderStatus('Error tracking order status');
    }
  };

  return (
    <div className="customer-container">
      <h2>Track Order Status</h2>
      <input
        type="text"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
      />
      <button onClick={handleTrackOrder}>Track Order</button>
      {orderStatus && <p><b>Order Status:</b> {orderStatus}</p>}
    </div>
  );
}

export default TrackOrderStatus;
