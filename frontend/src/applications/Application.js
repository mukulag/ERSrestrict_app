import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from "axios";

function App() {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/creating") // Ensure this endpoint is correct
      .then((result) => setApps(result.data))
      .catch((err) => setError("Failed to fetch apps"));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this apps?")) return;

    try {
      await axios.delete(`http://localhost:3000/apps/${id}`); // Adjust API endpoint
      setApps(apps.filter((app) => app.id !== id));
    } catch (err) {
      setError("Failed to delete app");
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
              {/* <th>Status</th> */}
              <th>Frequency</th>

              <th>Last Audit Date</th>
              <th>Next Audit Date</th>

              <th>Description Notes</th>
              <th>App Rights</th> {/* Add App Rights Column */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app, i) => (
              <tr key={app.id}>
                <td>{i + 1}</td>
                <td>{app.appName}</td>
                <td>{app.roles}</td>
                {/* <td>{app.status}</td> */}
                <td>{app.frequency_id[0].name}</td>
                <td>{app.last_audit_date}</td>
                <td>{app.next_audit_date}</td>

                <td>{app.desc}</td>
                <td>
              {app.app_rights.length > 0 ? (
                app.app_rights.map((right, index) => (
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
    onClick={() => handleDelete(app.id)}
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

export default App;
