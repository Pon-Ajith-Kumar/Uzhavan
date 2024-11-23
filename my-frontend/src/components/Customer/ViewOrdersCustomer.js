import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerLayout.css'; // Ensure correct path

function ViewOrdersCustomer() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:5000/orders/customer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="customer-container">
      <h2>Customer Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <p><b>Order ID:</b> {order.id}</p>
              <p><b>Product ID:</b> {order.product_id}</p>
              <p><b>Quantity:</b> {order.quantity}</p>
              <p><b>Status:</b> {order.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default ViewOrdersCustomer;
