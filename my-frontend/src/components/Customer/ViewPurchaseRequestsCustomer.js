import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerLayout.css'; // Ensure correct path

function ViewPurchaseRequestsCustomer() {
  const [purchaseRequests, setPurchaseRequests] = useState([]);

  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:5000/customer/purchase_requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPurchaseRequests(response.data.purchase_requests);
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
        <ul>
          {purchaseRequests.map(request => (
            <li key={request.id}>
              <p><b>Order ID:</b> {request.order_id}</p>
              <p><b>Product Name:</b> {request.product_name}</p>
              <p><b>Price:</b> {request.price}</p>
              <p><b>Status:</b> {request.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No purchase requests found.</p>
      )}
    </div>
  );
}

export default ViewPurchaseRequestsCustomer;
