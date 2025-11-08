import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewPurchaseRequests.css'; // Ensure correct path

function ViewPurchaseRequests() {
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:5000/admin/purchase_requests', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(response.data)) {
          setPurchaseRequests(response.data.reverse()); // Reverse the order to show the most recent first
        } else {
          setError('Unexpected response structure');
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching purchase requests:', error);
        setError('Failed to load purchase requests. Please try again later.');
      }
    };

    fetchPurchaseRequests();
  }, []);

  return (
    <div className="admin-container">
      <h2>All Purchase Requests</h2>
      {error && <p className="error-message">{error}</p>}
      {purchaseRequests.length > 0 ? (
        <div className="purchase-request-list">
          {purchaseRequests.map(request => (
            <div key={request.id} className="purchase-request-card">
              <p><b>Order ID:</b> {request.order_id}</p>
              <p><b>Product Name:</b> {request.product_name}</p>
              <p><b>Price:</b> ₹{request.price}</p>
              <p><b>Status:</b> {request.status}</p>
              <p><b>Customer Name:</b> {request.customer_name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No purchase requests found.</p>
      )}
    </div>
  );
}

export default ViewPurchaseRequests;
