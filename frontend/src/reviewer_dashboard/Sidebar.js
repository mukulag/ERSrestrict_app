import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>HOD'S</h2>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;