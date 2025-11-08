import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewPurchaseRequestsCustomer.css'; // Ensure correct path

function ViewPurchaseRequestsCustomer() {
  const [purchaseRequests, setPurchaseRequests] = useState([]);

  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:5000/customer/purchase_requests', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setPurchaseRequests(response.data.purchase_requests.reverse()); // Reverse the order to show the most recent first
      } catch (error) {
        console.error('Error fetching purchase requests:', error);
      }
    };

    fetchPurchaseRequests();
  }, []);

  return (
    <div className="customer-container">
      <h2>Purchase Requests</h2>
      {purchaseRequests.length > 0 ? (
        <div className="purchase-request-list">
          {purchaseRequests.map(request => (
            <div key={request.id} className="purchase-request-card">
              <p><b>Order ID:</b> {request.order_id}</p>
              <p><b>Product Name:</b> {request.product_name}</p>
              <p><b>Price:</b> ₹{request.price}</p>
              <p><b>Status:</b> {request.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No purchase requests found.</p>
      )}
    </div>
  );
}

export default ViewPurchaseRequestsCustomer;
