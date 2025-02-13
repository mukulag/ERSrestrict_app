import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Sidebar from '../components/Sidebar';

const EmployeeForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);  // To hold frequency data
    const [selectedUser, setSelectedUser] = useState('');  // Store selected frequency ID

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/register')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch register');
        }
        // console.log(response);  // Log response object
        return response.json();
      })
      .then((data) => {
        console.log('Fetched userhod:', data);
        setUsers(data);
      })
      .catch((error) => {
        console.error('Error userhod user:', error);
      });
  }, []);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value); // Set selected frequency ID
  };

  // Handle form submission to add a new employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEmployee = { name, email, 
        user_id: selectedUser // Add the selected user (HOD ID) here

      };
      const response = await axios.post('http://localhost:3000/employee', newEmployee);
      setSuccess('New employee added successfully');
      setName('');
      setEmail('');
      setSelectedUser(''); // Clear the selected user (HOD)

      setError('');
    } catch (err) {
      setError('Error adding new employee.');
      setSuccess('');
    }
  };

  return (
    <div className="app">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <div className="container mt-5">
          <h2>Add New Employee</h2>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Employee Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Employee Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
            <label>Select HOD:</label>
        <select value={selectedUser} onChange={handleUserChange}>
          <option value="">-- Select HOD --</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
            </div>


            <button type="submit" className="btn btn-primary">Add Employee</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
