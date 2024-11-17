import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FarmerOrders.css'; // Ensure you have the CSS file for styling

function FarmerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('http://localhost:5000/farmer/orders', config);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const token = localStorage.getItem('access_token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const urlMap = {
        accept: 'http://localhost:5000/farmer/accept_order',
        reject: 'http://localhost:5000/farmer/reject_order',
        ship: 'http://localhost:5000/farmer/ship_order',
        deliver: 'http://localhost:5000/farmer/deliver_order'
      };
      await axios.put(urlMap[action], { order_id: orderId }, config);
      fetchOrders();
    } catch (error) {
      console.error(`Error with action ${action} for order ${orderId}:`, error);
    }
  };

  return (
    <div className="farmer-orders">
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.product.name}</td>
                <td>{order.quantity}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === 'pending' && (
                    <>
                      <button onClick={() => handleOrderAction(order.id, 'accept')}>Accept</button>
                      <button onClick={() => handleOrderAction(order.id, 'reject')}>Reject</button>
                    </>
                  )}
                  {order.status === 'accepted' && (
                    <button onClick={() => handleOrderAction(order.id, 'ship')}>Ship</button>
                  )}
                  {order.status === 'shipped' && (
                    <button onClick={() => handleOrderAction(order.id, 'deliver')}>Deliver</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default FarmerOrders;
