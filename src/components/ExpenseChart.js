import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './ExpenseChart.css';
import {
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ incomeData = [], expenseData = [] }) => {
  const aggregateData = (data) => {
    return data.reduce((acc, entry) => {
      const amount = Math.abs(entry.sum); // Get the absolute value of the sum
      return acc + amount; // Sum up the amounts
    }, 0);
  };

  const totalIncome = aggregateData(incomeData);
  const totalExpense = aggregateData(expenseData);
  
  // Calculate remaining balance
  const remainingBalance = totalIncome - totalExpense;

  // Calculate the percentage of expenses relative to income
  const expensePercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  const doughnutData = {
    labels: ['Balance', 'Expense'],
    datasets: [
      {
        data: [remainingBalance, totalExpense],
        backgroundColor: ['rgb(13, 184, 161)', 'rgba(252, 86, 26, 0.708)'], 
        borderWidth: 0, 
      },
    ],
  };

  const options = {
    cutout: '63%', 
  };

  return (
    <div className="expense">
      <div className="doughnut">
        <h6 style={{ backgroundColor: 'rgba(252, 86, 26, 0.708)', padding: '5px', color: '#fff' }}>Expense Overview</h6>
        <Doughnut data={doughnutData} options={options} />
        <div className="expense-percentage">
          <span>{`Expenses: ${expensePercentage.toFixed(2)}% of Income`}</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
