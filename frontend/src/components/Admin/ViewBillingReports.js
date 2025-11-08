import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewBillingReports.css'; // Ensure correct path

function ViewBillingReports() {
  const [billingReports, setBillingReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillingReports = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:5000/admin/billing_report', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(response.data)) {
          // Sort reports by descending order of ID
          const sortedReports = response.data.sort((a, b) => b.id - a.id);
          setBillingReports(sortedReports);
        } else {
          setError('Unexpected response structure');
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching billing reports:', error);
        setError('Failed to load billing reports. Please try again later.');
      }
    };

    fetchBillingReports();
  }, []);

  // Separate billing reports by customer
  const reportsByCustomer = billingReports.reduce((acc, report) => {
    acc[report.customer_name] = acc[report.customer_name] || [];
    acc[report.customer_name].push(report);
    return acc;
  }, {});

  return (
    <div className="admin-container">
      <h2>Billing Reports</h2>
      {error && <p className="error-message">{error}</p>}
      {Object.keys(reportsByCustomer).length > 0 ? (
        Object.keys(reportsByCustomer).map(customer => (
          <div key={customer} className="customer-section">
            <h3>Customer: {customer}</h3>
            <div className="billing-report-list">
              {reportsByCustomer[customer].map(report => (
                <div key={report.id} className="billing-report-card">
                  <p><b>Report ID:</b> {report.id}</p>
                  <p><b>Order ID:</b> {report.order_id}</p>
                  <p><b>Product Name:</b> {report.product_name}</p>
                  <p><b>Price:</b> ₹{report.price}</p>
                  <p><b>Status:</b> {report.status}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No billing reports found.</p>
      )}
    </div>
  );
}

export default ViewBillingReports;
