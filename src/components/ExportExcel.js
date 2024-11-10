import React, { useState } from 'react';
import excel from '../components/Assets/excel.png';
import './ExportExcel.css';

const ExportExcel = () => {
  const [userEmail, setUserEmail] = useState(sessionStorage.getItem('emailId') || '');

  const handleExport = async () => {
    if (!userEmail) {
      alert("User not logged in");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/export-transactions?userEmail=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export transactions');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error(error);
      alert("Error exporting transactions");
    }
  };

  return (
    <div className='export-container'>
      <button className="export"
      onClick={handleExport}>
      <img src={excel}
          alt="export Icon" 
          style={{width: '23px', height: '22px' }} 
        />
        <span> Export</span>
        </button>
    </div>
  );
};

export default ExportExcel;
