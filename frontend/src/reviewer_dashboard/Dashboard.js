import React from 'react';
import Navbar from './Navbar';  // Assuming you have a Navbar component
import Sidebar from './Sidebar';  // Assuming you have a Sidebar component
import AuditList from '../audit/AuditList';  // Import the AuditList component

const Dashboard = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Welcome to the HOD Dashboard!</h1>
            <p>HOD.</p>
          </div>
          {/* Add AuditList to the dashboard */}
          <AuditList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
