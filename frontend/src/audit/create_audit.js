import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateAuditForm = () => {
  const [empId, setEmpId] = useState('');
  const [selectedemp, setSelectedEmp] = useState('');

  const [frequencyId, setFrequencyId] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [userId, setUserId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(''); // Added state for selected user
  const [applicationId, setApplicationId] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [auditDate, setAuditDate] = useState('');
  const [inactive, setInactive] = useState(false);
  const [rights, setRights] = useState('');
  const [reviewerRemarks, setReviewerRemarks] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [frequencies, setFrequencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Fetch frequencies
    fetch('http://localhost:3000/frequency')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch frequencies');
        }
        return response.json();
      })
      .then((data) => {
        setFrequencies(data);
      })
      .catch((error) => {
        console.error('Error fetching frequencies:', error);
      });

    // Fetch users
    fetch('http://localhost:3000/register')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });

    // Fetch applications
    fetch('http://localhost:3000/creating')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        return response.json();
      })
      .then((data) => {
        setApplications(data);
      })
      .catch((error) => {
        console.error('Error fetching applications:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAudit = {
      emp_id: empId,
      frequency_id: frequencyId,
      user_id: userId,
      application_id: applicationId,
      audit_date: auditDate,
      inactive: inactive,
      rights: rights,
      reviewer_remarks: reviewerRemarks,
    };

    try {
      const response = await axios.post('http://localhost:3000/audit', newAudit);
      setSuccess('Audit created successfully');
      setError('');
    } catch (err) {
      setError('Error creating audit');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Audit</h2>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Select Employee Id:</label>
          <select value={empId} onChange={(e) => setEmpId(e.target.value)}>
            <option value="">-- Select Emp --</option>
            {users.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Select Frequency:</label>
          <select value={frequencyId} onChange={(e) => setFrequencyId(e.target.value)}>
            <option value="">-- Select Frequency --</option>
            {frequencies.map((frequency) => (
              <option key={frequency._id} value={frequency._id}>
                {frequency.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Select HOD:</label>
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">-- Select HOD --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Select Application:</label>
          <select value={applicationId} onChange={(e) => setApplicationId(e.target.value)}>
            <option value="">-- Select Application --</option>
            {applications.map((application) => (
              <option key={application._id} value={application._id}>
                {application.appName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="audit_date" className="form-label">Audit Date</label>
          <input
            type="date"
            id="audit_date"
            className="form-control"
            value={auditDate}
            onChange={(e) => setAuditDate(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="inactive" className="form-label">Inactive</label>
          <input
            type="checkbox"
            id="inactive"
            className="form-check-input"
            checked={inactive}
            onChange={(e) => setInactive(e.target.checked)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="rights" className="form-label">Rights</label>
          <textarea
            id="rights"
            className="form-control"
            value={rights}
            onChange={(e) => setRights(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="reviewer_remarks" className="form-label">Reviewer Remarks</label>
          <textarea
            id="reviewer_remarks"
            className="form-control"
            value={reviewerRemarks}
            onChange={(e) => setReviewerRemarks(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">Create Audit</button>
      </form>
    </div>
  );
};

export default CreateAuditForm;
