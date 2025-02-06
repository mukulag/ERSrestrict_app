import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import axios from "axios";

function User() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/creating") // Ensure this endpoint is correct
      .then((result) => setUsers(result.data))
      .catch((err) => setError("Failed to fetch users"));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:3000/users/${id}`); // Adjust API endpoint
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  return (
    <div className="app">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />

        {error && <p className="text-danger">Error: {error}</p>}

        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Application Name</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Last Reviewed Date</th>
              <th>Description Notes</th>
              <th>App Rights</th> {/* Add App Rights Column */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id}>
                <td>{i + 1}</td>
                <td>{user.appName}</td>
                <td>{user.roles}</td>
                <td>{user.status}</td>
                <td>{user.lastReviewed}</td>
                <td>{user.desc}</td>
                <td>
        {user.app_rights.length > 0 ? (
          user.app_rights.map((right, index) => (
            <span key={index} className="badge bg-info me-2">
              {right}
            </span>
          ))
        ) : (
          <span className="text-muted">No rights assigned</span>
        )}
      </td>
                <td>
  <button className="btn btn-primary">
    <i className="fa fa-pencil" aria-hidden="true"></i> Edit
  </button>
  
  <button className="btn btn-info mx-2">
    <i className="fa fa-eye" aria-hidden="true"></i> View
  </button>
  
  <button 
    className="btn btn-danger"
    onClick={() => handleDelete(user.id)}
  >
    <i className="fa fa-trash-o" aria-hidden="true"></i> Delete
  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
