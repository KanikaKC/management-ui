import React, { useState, useEffect } from 'react';
import './Preferences.css'; // Ensure your CSS file is updated

const Preferences = () => {
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [currency, setCurrency] = useState('INR'); // Default currency to INR

  useEffect(() => {
    // Load preferences from localStorage
    const savedTimeFormat = localStorage.getItem('timeFormat') || '12-hour';
    const savedCurrency = localStorage.getItem('currency') || 'INR'; // Default to INR
    setTimeFormat(savedTimeFormat);
    setCurrency(savedCurrency);
  }, []);

  const handleTimeFormatChange = (e) => {
    const selectedFormat = e.target.value;
    setTimeFormat(selectedFormat);
    localStorage.setItem('timeFormat', selectedFormat); // Save to localStorage
  };

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
    localStorage.setItem('currency', selectedCurrency); // Save to localStorage
  };

  return (
    <div className="preferences-container">
      <h2>Preferences</h2>
      <div className="preference-item">
        <label htmlFor="time-format">Time Format:</label>
        <select id="time-format" value={timeFormat} onChange={handleTimeFormatChange}>
          <option value="12-hour">12-hour</option>
          <option value="24-hour">24-hour</option>
        </select>
      </div>
      <div className="preference-item">
        <label htmlFor="currency">Currency:</label>
        <select id="currency" value={currency} onChange={handleCurrencyChange}>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          {/* Add more currencies as needed */}
        </select>
      </div>
    </div>
  );
};

// Utility function to format currency
export const formatCurrency = (amount, currencyCode) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

export default Preferences;
