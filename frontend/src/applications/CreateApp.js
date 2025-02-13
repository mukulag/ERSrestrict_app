import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
const CreateApp = () => {
  const [frequencies, setFrequencies] = useState([]);  // To hold frequency data
  const [selectedFrequency, setSelectedFrequency] = useState('');  // Store selected frequency ID
  const [appName, setAppName] = useState('');
  const [roles, setRoles] = useState('');
  // const [status, setStatus] = useState('');
  const [last_audit_date, setLastAuditDate] = useState('');
  const [next_audit_date, setNextAuditDate] = useState('');
    const [desc, setDesc] = useState('');
  const [appRights, setAppRights] = useState(['']);  // Initial state with one input field
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  fetch('http://localhost:3000/frequency')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch frequencies');
      }
      // console.log(response);  // Log response object
      return response.json();
    })
    .then((data) => {
      console.log('Fetched data:', data);
      setFrequencies(data);
    })
    .catch((error) => {
      console.error('Error fetching frequencies:', error);
    });
}, []);


const handleFrequencyChange = (e) => {
  setSelectedFrequency(e.target.value); // Set selected frequency ID
};
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const newUser = {
      appName,
      roles,
      // status,
      frequency_id: selectedFrequency, // Save the selected frequency ID as reference
      next_audit_date,
      last_audit_date,
      desc,
      app_rights: appRights.filter(right => right.trim() !== '')  // Remove empty inputs
    };

    try {
      const response = await axios.post('http://localhost:3000/creating', newUser);
      console.log('User Created:', response.data);
    } catch (err) {
      setError('Failed to create  Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle input change for app_rights
  const handleAppRightChange = (index, value) => {
    const updatedAppRights = [...appRights];
    updatedAppRights[index] = value;
    setAppRights(updatedAppRights);
  };

  // Function to add a new input field for app_rights
  const addAppRight = () => {
    setAppRights([...appRights, '']);
  };

  // Function to remove an input field for app_rights
  const removeAppRight = (index) => {
    const updatedAppRights = appRights.filter((_, i) => i !== index);
    setAppRights(updatedAppRights);
  };

  return (
    <div className="app">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <div className="container mt-5">
          <h2>Add new Application</h2>
          {error && <p className="text-danger">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="appName" className="form-label">Application Name</label>
              <input
                type="text"
                id="appName"
                className="form-control"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="roles" className="form-label">Roles</label>
              <input
                type="text"
                id="roles"
                className="form-control"
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
                required
                placeholder="Separate roles by commas (e.g., Admin, User)"
              />
            </div>

            <div className="mb-3">
            <label>Select Frequency:</label>
        <select value={selectedFrequency} onChange={handleFrequencyChange}>
          <option value="">-- Select Frequency --</option>
          {frequencies.map(frequency => (
            <option key={frequency._id} value={frequency._id}>
              {frequency.name}
            </option>
          ))}
        </select>
            </div>

            <div className="mb-3">
              <label htmlFor="app_rights" className="form-label">Application Rights</label>
              {appRights.map((right, index) => (
                <div key={index} className="d-flex mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={right}
                    onChange={(e) => handleAppRightChange(index, e.target.value)}
                    placeholder="Enter app right"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => removeAppRight(index)}
                    disabled={appRights.length === 1}
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-success"
                onClick={addAppRight}
              >
                +
              </button>
            </div>

            {/* <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div> */}

            <div className="mb-3">
              <label htmlFor="last_audit_date" className="form-label">Last Audit Date</label>
              <input
                type="date"
                id="last_audit_date"
                className="form-control"last_audit_date
                value={last_audit_date}
                onChange={(e) => setLastAuditDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="next_audit_date" className="form-label">Next Audit Date</label>
              <input
                type="date"
                id="next_audit_date"
                className="form-control"next_audit_date
                value={next_audit_date}
                onChange={(e) => setNextAuditDate(e.target.value)}
                required
              />
            </div>


            <div className="mb-3">
              <label htmlFor="desc" className="form-label">Description/Notes</label>
              <textarea
                id="desc"
                className="form-control"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Additional notes about the application"
                rows="3"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Add Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateApp;
