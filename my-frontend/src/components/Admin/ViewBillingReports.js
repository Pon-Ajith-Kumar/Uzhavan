import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewBillingReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/billing_report', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching billing reports:', error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Billing Reports List</h2>
      <ul>
        {reports.map(report => (
          <li key={report.id}>{report.details}</li>
        ))}
      </ul>
    </div>
  );
}

export default ViewBillingReports;
