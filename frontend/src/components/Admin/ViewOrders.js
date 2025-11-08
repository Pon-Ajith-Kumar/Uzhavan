import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewOrders.css'; // Ensure you have the CSS file for styling

function ViewOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>Orders List</h2>
      <div className="order-grid">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <h3 className="product-name">{order.product_name}</h3>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default ViewOrders;