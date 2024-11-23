import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerLayout.css'; // Ensure correct path

function ViewBillingReportsCustomer() {
  const [billingReports, setBillingReports] = useState([]);

  useEffect(() => {
    const fetchBillingReports = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:5000/customer/billing_reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBillingReports(response.data.billing_reports);
      } catch (error) {
        console.error('Error fetching billing reports:', error);
      }
    };

    fetchBillingReports();
  }, []);

  return (
    <div className="customer-container">
      <h2>Billing Reports</h2>
      {billingReports.length > 0 ? (
        <ul>
          {billingReports.map(report => (
            <li key={report.id}>
              <p><b>Order ID:</b> {report.order_id}</p>
              <p><b>Product Name:</b> {report.product_name}</p>
              <p><b>Price:</b> {report.price}</p>
              <p><b>Status:</b> {report.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No billing reports found.</p>
      )}
    </div>
  );
}

export default ViewBillingReportsCustomer;
