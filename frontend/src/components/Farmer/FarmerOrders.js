import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      const sortedOrders = response.data.orders.sort((a, b) => b.id - a.id); // Sort orders in descending order by ID
      setOrders(sortedOrders);
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
      toast.success(`Order ${action}ed successfully!`); // Show success message
      fetchOrders();
    } catch (error) {
      console.error(`Error with action ${action} for order ${orderId}:`, error);
      toast.error(`Failed to ${action} order.`);
    }
  };

  return (
    <div className="farmer-orders">
      <ToastContainer />
      <h2>Your Orders</h2>
      <div className="order-grid">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="image-container">
                {order.product.image_path ? (
                  <img src={`/images/${order.product.image_path}`} alt={order.product.name} />
                ) : (
                  <div className="placeholder-image">Image Not Available</div>
                )}
              </div>
              <div className="order-info">
                <h3 className="product-name">{order.product.name}</h3> {/* Center the Product Name */}
                <p><strong>Order ID:</strong> {order.id}</p> {/* Displaying the Order ID */}
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <div className="order-actions">
                  {order.status === 'pending' && (
                    <>
                      <button className="accept-button" onClick={() => handleOrderAction(order.id, 'accept')}>Accept</button>
                      <button className="reject-button" onClick={() => handleOrderAction(order.id, 'reject')}>Reject</button>
                    </>
                  )}
                  {order.status === 'accepted' && (
                    <button className="ship-button" onClick={() => handleOrderAction(order.id, 'ship')}>Ship</button>
                  )}
                  {order.status === 'shipped' && (
                    <button className="deliver-button" onClick={() => handleOrderAction(order.id, 'deliver')}>Deliver</button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default FarmerOrders;
