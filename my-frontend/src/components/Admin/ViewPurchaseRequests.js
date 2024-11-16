import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewPurchaseRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/purchase_requests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching purchase requests:', error);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div>
      <h2>Purchase Requests List</h2>
      <ul>
        {requests.map(request => (
          <li key={request.id}>{request.product_name} - {request.quantity}</li>
        ))}
      </ul>
    </div>
  );
}

export default ViewPurchaseRequests;
