import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Sidebar from '../components/Sidebar';

const EmployeeIndex = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/employee');
      setEmployees(response.data);
    } catch (err) {
      setError('Error fetching employee data.');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="app">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <div className="container mt-5">
          <h2>Employee List</h2>
          <a href='/employeescreate'>
            <button  className='btn btn-md btn-primary'>Create New Employee</button>
          </a>
          <br/>
          <br/>
          {error && <p className="text-danger">{error}</p>}

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>HOD NAME</th>

              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center">No employees found</td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.user_id?.name}</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeIndex;
