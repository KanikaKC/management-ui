import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './CategoryChart.css';

const CategoryChart = () => {

Chart.register(...registerables);

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const userEmail = sessionStorage.getItem('emailId');
     
      try {
        const response = await fetch(`http://localhost:8080/transactions?userEmail=${encodeURIComponent(userEmail)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch transactions');
        }
        
        const data = await response.json();
        setExpenses(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + expense.sum;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Expenses',
        data: Object.values(categoryData).map(value => (value < 0 ? Math.abs(value) : 0)), 
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Income',
        data: Object.values(categoryData).map(value => (value > 0 ? value : 0)), 
        backgroundColor: 'rgba(75, 192, 192, 0.6)', 
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-4 chart" >
      <h3>Expenses and Income by Category</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <Bar data={chartData} options={{ maintainAspectRatio: true }} />
      </div>
    </div>
  );
};

export default CategoryChart;
