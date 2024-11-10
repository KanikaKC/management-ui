import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Balance.css';

const Balance = () => {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      const emailId = sessionStorage.getItem('emailId');
      const token = sessionStorage.getItem('token');

      try {
        const response = await fetch(`http://localhost:8080/balance?userEmail=${emailId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          sessionStorage.clear();
          navigate("/", { replace: true });
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        const balanceData = await response.json();
        setBalance(balanceData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBalance();
  }, [navigate]);

  const maxAmount = 100; // Set this to your defined maximum amount
  const baseRadius = 70; // Base radius for the semi-circle
  const adjustedRadius = Math.max(20, Math.min(baseRadius, balance * 0.5)); // Adjust radius based on balance
  const circumference = Math.PI * adjustedRadius; // Circumference of a semi-circle
  const arcLength = balance ? Math.min(circumference, (balance / maxAmount) * circumference) : 0; // Calculate arc length based on balance

  // Set fixed SVG size
  const svgWidth = 150;
  const svgHeight = 100;

  return (
    <div className="balance-container">
      {error && <div className="alert alert-danger">{error}</div>}
      <svg width={svgWidth} height={svgHeight}>
        {/* Full semi-circle for the maximum amount */}
        <path
          d={`M ${svgWidth / 2 - adjustedRadius} ${svgHeight} A ${adjustedRadius} ${adjustedRadius} 0 1 1 ${svgWidth / 2 + adjustedRadius} ${svgHeight}`}
          fill="rgb(13, 184, 161)"
          stroke="rgba(15, 233, 204, 0.433)"
          strokeWidth="10"
        />
        {/* Semi-circle for current balance */}
        <path
          d={`M ${svgWidth / 2 - adjustedRadius} ${svgHeight} A ${adjustedRadius} ${adjustedRadius} 0 1 1 ${svgWidth / 2 + adjustedRadius} ${svgHeight}`}
          fill="none"
          stroke="rgba(252, 86, 26, 0.708)"
          strokeWidth="5"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={circumference}
        />
        {/* Balance text in the center of the semi-circle */}
        <text
          x="50%"
          y="70%" // Positioning lower to fit inside the semi-circle
          textAnchor="middle"
          dominantBaseline="middle"
          className="balance-text"
          style={{ fontSize: `${adjustedRadius * 0.2}px` }} // Dynamic font size based on radius
        >
          {balance !== null ? balance.toFixed(2) : "Loading..."}
        </text>
        {/* Spending text below the balance */}
        <text
          x="50%"
          y="93%" // Position below the balance text
          textAnchor="middle"
          dominantBaseline="middle"
          className="spending-text"
        >
          Left to Spend
        </text>
      </svg>
    </div>
  );
};

export default Balance;
