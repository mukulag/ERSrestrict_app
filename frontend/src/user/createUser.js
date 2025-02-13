import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
      company_name: companyName,
      role,
    };

    try {
      const response = await axios.post('http://localhost:3000/register', newUser);
      setSuccess('User created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setCompanyName('');
      setRole(null);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error occurred while creating user');
    }
  };

  return (
    <div className="app">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <div className="container mt-5">
          <h2>Add New User</h2>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">User Name</label>
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
              <label htmlFor="email" className="form-label">User Email</label>
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
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="company_name" className="form-label">Company Name</label>
              <input
                type="text"
                id="company_name"
                className="form-control"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                id="role"
                className="form-control"
                value={role}
                onChange={(e) => setRole(Number(e.target.value))}
                required
              >
                <option value="">Select Role</option>
                <option value="1">HOD</option>
                <option value="2">Normal</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">Add User</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
