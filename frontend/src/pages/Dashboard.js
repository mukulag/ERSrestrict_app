import React from 'react';
import '../styles.css';
import Navbar from "../components/Navbar";
import Sidebar from '../components/Sidebar';
// Dashboard component
const Dashboard = () => {
  return (
    <div className="app">
    <Navbar />
    <div className="content-wrapper">
      <Sidebar />
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to the Dashboard!</h1>
        <p>Your overview of the application.</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Total Application</h3>
          <p>150</p>
        </div>

        <div className="dashboard-card">
          <h3>Total HODS</h3>
          <p>80</p>
        </div>

        <div className="dashboard-card">
          <h3>No of Restrict</h3>
          <p>120</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Frequency</h3>
          <p>$12,500</p>
        </div>
      </div>

      <div className="dashboard-footer">
        <p>Dashboard Overview - 2025</p>
      </div>
    </div>
    </div>

    </div>

  );
};

export default Dashboard;
