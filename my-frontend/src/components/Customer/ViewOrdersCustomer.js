import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewOrdersCustomer.css'; // Ensure correct path

function ViewOrdersCustomer() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:5000/orders/customer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sortedOrders = response.data.orders.sort((a, b) => b.id - a.id); // Sort orders in descending order based on ID
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:5000/orders/cancel', { order_id: orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order cancelled successfully!');
      // Refresh orders after cancelling
      const response = await axios.get('http://localhost:5000/orders/customer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedOrders = response.data.orders.sort((a, b) => b.id - a.id); // Sort orders in descending order based on ID
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Error cancelling order');
    }
  };

  const renderOrdersByStatus = (orders, status, title) => {
    const filteredOrders = orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
    return (
      <div key={status} className="order-status-section">
        <h3>{title}</h3>
        <div className="order-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <p><b>Order ID:</b> {order.id}</p>
                <p><b>Product ID:</b> {order.product_id}</p>
                <p><b>Product Name:</b> {order.product.name || 'Loading...'}</p>
                <p><b>Status:</b> {order.status}</p>
                {order.status.toLowerCase() === 'pending' && (
                  <button onClick={() => handleCancelOrder(order.id)}>Cancel Order</button>
                )}
              </div>
            ))
          ) : (
            <p className="none-text">None</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="customer-container">
      <h2>Customer Orders</h2>
      {orders.length > 0 ? (
        <div>
          {renderOrdersByStatus(orders, 'Pending', 'Pending Orders')}
          {renderOrdersByStatus(orders, 'Accepted', 'Accepted Orders')}
          {renderOrdersByStatus(orders, 'Shipped', 'Shipped Orders')}
          {renderOrdersByStatus(orders, 'Delivered', 'Delivered Orders')}
          {renderOrdersByStatus(orders, 'Cancelled', 'Cancelled Orders')}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default ViewOrdersCustomer;
