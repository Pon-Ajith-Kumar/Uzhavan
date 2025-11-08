import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewBillingReportsCustomer.css'; // Ensure correct path

function ViewBillingReportsCustomer() {
  const [billingReports, setBillingReports] = useState([]);

  useEffect(() => {
    const fetchBillingReports = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:5000/customer/billing_reports', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const filteredReports = response.data.billing_reports
          .reverse() // Show the most recent first
          .filter(report => report.status.toLowerCase() !== 'pending'); // Exclude pending status
        setBillingReports(filteredReports);
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
        <div className="billing-report-list">
          {billingReports.map(report => (
            <div key={report.id} className="billing-report-card">
              <p><b>Order ID:</b> {report.order_id}</p>
              <p><b>Product Name:</b> {report.product_name}</p>
              <p><b>Price:</b> ₹{report.price}</p>
              <p><b>Status:</b> {report.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No billing reports found.</p>
      )}
    </div>
  );
}

export default ViewBillingReportsCustomer;
