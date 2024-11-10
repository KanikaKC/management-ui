import React from 'react';
import './InfoBox.css'; // Import your CSS for styling

const InfoBox = ({ message, color }) => {
  return (
    <div className="info-box" style={{ backgroundColor: color }}>
      {message}
    </div>
  );
};

export default InfoBox;
