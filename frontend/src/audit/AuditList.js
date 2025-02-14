import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuditList = () => {
  const [audits, setAudits] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all audits
    const fetchAudits = async () => {
      try {
        const response = await axios.get('http://localhost:3000/audit');
        setAudits(response.data);
      } catch (err) {
        setError('Failed to fetch audits');
        console.error('Error fetching audits:', err);
      }
    };

    fetchAudits();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Audit List</h2>

      {error && <p className="text-danger">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            {/* <th>Employee ID</th> */}
            <th>Frequency</th>
            <th>HOD</th>
            <th>Application</th>
            {/* <th>Audit Date</th> */}
            <th>Rights</th>
            {/* <th>Rights</th> */}
            <th>Reviewer Remarks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {audits.length > 0 ? (
    audits.map((audit) => (
      <tr key={audit._id}>
        {/* <td>{audit.emp_id?.name}</td> */}
        <td>{audit.frequency_id[0].name}</td>
        <td>{audit.user_id?.name}</td>
        <td>{audit.application_id.appName}</td>
        <td>
          {audit.application_id?.app_rights
            ? Object.entries(audit.application_id.app_rights).map(([key, value]) => (
                <div key={key}>
                  {key}: 
                  <input
                    type="checkbox"
                    // checked={value}
                    // onChange={(e) => {
                    //   // Handle checkbox change here
                    //   const newValue = e.target.checked;
                    //   console.log(`${key} is now ${newValue}`);
                    //   // You can update the state or make an API call here
                    // }}
                  />
                </div>
              ))
            : "No rights"}
            <button> Revoke Access </button>
            <button> Continue Access </button>
            <button> Grant All Access </button>

        </td>
        {/* <td>{audit.audit_date}</td> */}
        {/* <td>{audit.rights}</td> */}
        <td>
          <textarea placeholder='Comments'></textarea>
        </td>
        <td><button>Submit</button></td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8">No audits found</td>
    </tr>
  )}
</tbody>
      </table>
    </div>
  );
};

export default AuditList;
