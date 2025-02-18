import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function UploadExcel() {
    const [fileData, setFileData] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (evt) => {
            const binaryString = evt.target.result;
            const wb = XLSX.read(binaryString, { type: 'binary' });

            // Get the first sheet data
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws);
            setFileData(data);

            // Send JSON data to the backend
            sendJsonToBackend(data);
        };

        reader.readAsBinaryString(file);
    };

    const sendJsonToBackend = async (jsonData) => {
        try {
            const response = await axios.post('http://localhost:3000/excelUpload', jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Data sent to backend successfully:', response.data);
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };

    return (
        <div className="app">
            <Navbar />
            <div className="content-wrapper">
                <Sidebar />
                <div className="dashboard-container">
                    <div className="container mt-5">
                        <h2>Upload Excel For Reviews</h2>
                        <div>
                            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                            <pre>{JSON.stringify(fileData, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadExcel;
