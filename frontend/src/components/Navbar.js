import React from 'react';
import '../styles.css';
const Navbar = () => {
  return (
    <div className="navbar">
      <h1>My Dashboard</h1>
      <div className="user-info">
        <span>Welcome, User!</span>
      </div>
    </div>
  );
};

export default Navbar;