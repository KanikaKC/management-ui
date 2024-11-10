import React, { useEffect, useState } from 'react';
import './Goal.css';
import './InfoBox.css'; // Import the CSS for the InfoBox
import editIcon from './Assets/edit-text.png'; 
import deleteIcon from './Assets/trash.png';
import InfoBox from './InfoBox'; // Import the new InfoBox component

const Goal = () => {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [balance, setBalance] = useState(0);
  const [infoMessage, setInfoMessage] = useState('');
  const [infoColor, setInfoColor] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchGoals = async () => {
      const userEmail = sessionStorage.getItem('emailId');
      if (!userEmail) {
        setError('User not logged in');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/goals?userEmail=${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch goals');
          return;
        }

        const data = await response.json();
        setGoals(data);
      } catch (err) {
        setError('An error occurred while fetching goals');
      }
    };

    const fetchBalance = async () => {
      const userEmail = sessionStorage.getItem('emailId');
      const response = await fetch(`http://localhost:8080/balance?userEmail=${encodeURIComponent(userEmail)}`);

      if (response.ok) {
        const balance = await response.text();
        const parsedBalance = parseFloat(balance);
        setBalance(parsedBalance);
      } else {
        setError('Failed to fetch balance');
      }
    };

    const fetchTransactions = async () => {
      const userEmail = sessionStorage.getItem('emailId');
      try {
        const response = await fetch(`http://localhost:8080/transactions?userEmail=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            // Transactions are fetched, but not stored since they're not being used directly
          } else {
            setError('Invalid data format from transactions');
          }
        } else {
          setError('Failed to fetch transactions');
        }
      } catch (error) {
        setError('An error occurred while fetching transactions');
      }
    };

    fetchGoals();
    fetchBalance();
    fetchTransactions(); // Fetch transactions data
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userEmail = sessionStorage.getItem('emailId');
    const formattedTargetAmount = parseFloat(targetAmount).toFixed(2);

    if (editingGoalId) {
      try {
        const response = await fetch(`http://localhost:8080/update-savings?goalId=${editingGoalId}&additionalSavings=${Number(targetAmount)}&dueDate=${dueDate}&goalName=${encodeURIComponent(goalName)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to update savings goal');
          return;
        }

        const updatedGoal = await response.json();
        setGoals((prevGoals) =>
          prevGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
        );
      } catch (error) {
        setError('An error occurred while updating the savings goal');
      }
    } else {
      const savingsGoalDto = {
        userEmail,
        goalName,
        targetAmount: formattedTargetAmount,
        dueDate,
      };

      try {
        const response = await fetch("http://localhost:8080/set-goal", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(savingsGoalDto),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to save savings goal');
          return;
        }

        const goal = await response.json();
        setGoals((prevGoals) => [...prevGoals, goal]);
        setInfoMessage(`Goal "${goalName}" set with target amount of ₹${formattedTargetAmount}`);
      } catch (error) {
        setError('An error occurred while saving the savings goal');
      }
    }

    setGoalName('');
    setTargetAmount('');
    setDueDate('');
    setEditingGoalId(null);
  };

  const handleEdit = (goal) => {
    setGoalName(goal.goalName);
    setTargetAmount(goal.targetAmount);
    setDueDate(goal.dueDate);
    setEditingGoalId(goal.id);
  };

  const handleDelete = async (goalId) => {
    try {
      const response = await fetch(`http://localhost:8080/delete-savings?goalId=${goalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete savings goal');
        return;
      }

      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
      setInfoMessage(`Goal deleted successfully.`);
    } catch (error) {
      setError('An error occurred while deleting the savings goal');
    }
  };

  useEffect(() => {
    const updateInfoMessage = () => {
      const goalsMet = goals.filter(goal => new Date(goal.dueDate) >= new Date(today) && balance >= parseFloat(goal.targetAmount));
      const goalsNotMet = goals.filter(goal => new Date(goal.dueDate) >= new Date(today) && balance < parseFloat(goal.targetAmount));

      if (goalsMet.length > 0) {
        const totalSaved = goalsMet.reduce((acc, goal) => acc + parseFloat(goal.targetAmount), 0);
        setInfoMessage(`Goals Met: You saved ₹${totalSaved}`);
        setInfoColor('lightgreen'); // Color for goals met
      } else if (goalsNotMet.length > 0) {
        const totalIncreased = goalsNotMet.reduce((acc, goal) => acc + parseFloat(goal.targetAmount), 0);
        if (balance > 0) {
          setInfoMessage(`Goals Not Met: You saved ₹${balance}, but missed goals worth ₹${totalIncreased}.`);
          setInfoColor('rgba(255, 255, 0, 0.37)'); // Color for goals not met but with some savings
        } else if (balance === 0) {
          setInfoMessage(`Goals Not Met: You did not achieve any goals. You had to save ₹${totalIncreased}.`);
          setInfoColor('red'); // Color for zero balance
        } else {
          setInfoMessage(`Goals Not Met: Your expenses exceeded your savings by ₹${Math.abs(balance)}. You needed to save ₹${totalIncreased}.`);
          setInfoColor('red'); // Color for negative balance
        }
      } 
    };

    updateInfoMessage();
  }, [goals, balance, today]); // Dependencies include goals, balance, and today

  return (
    <div className="container mt-5" style={{ maxWidth: '600px', left: 'auto', position: 'relative' }}>
      <div className="goal-container">
        <h4 className="card-header goal-header">Savings Goal</h4>
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="form-group-goal">
            <label htmlFor="goalName">Goal Name</label>
            <input
              type="text"
              id="goalName"
              className="form-control"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              required
            />
          </div>
          <div className="form-group-goal">
            <label htmlFor="targetAmount">Target Amount (₹)</label>
            <input
              type="number"
              id="targetAmount"
              className="form-control"
              value={targetAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^[0-9]+(\.[0-9]{0,2})?$/.test(value)) {
                  setTargetAmount(value);
                }
              }}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group-goal">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              required
            />
          </div>

          <div className="form-group-button">
            <button type="submit" className="btn btn-secondary" style={{ borderRadius: '0', backgroundColor: editingGoalId ? '#ff9800' : 'rgb(120, 163, 224)', color: '#fff' }}>
              {editingGoalId ? 'Update Goal' : 'Set Goal'}
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        <h6 onClick={() => setIsExpanded(!isExpanded)} className="goals-header" style={{ cursor: 'pointer' }}>
          {isExpanded ? '−' : '+'} Your Savings Goals
        </h6>

        {isExpanded && (
          <div className="goals-background">
            {goals.length === 0 ? (
              <div className="alert alert-info">No savings goals set yet.</div>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Goal Name</th>
                    <th>Target Amount</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {goals.map((goal) => (
                    <tr key={goal.id}>
                      <td>{goal.goalName}</td>
                      <td>{parseFloat(goal.targetAmount)}</td>
                      <td>{goal.dueDate}</td>
                      <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button 
                          className="btn-edit"
                          data-sbtip="Edit Goal"
                          onClick={() => handleEdit(goal)}>
                          <img src={editIcon} alt="Edit" />
                        </button>
                        <button
                          className="btn-delete"
                          data-sbtip="Delete Goal"
                          onClick={() => handleDelete(goal.id)}>
                          <img src={deleteIcon} alt="Delete" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* InfoBox positioned here */}
      <div style={{ position: 'absolute', top: '15px', right: '0px', width: '-10px' }}>
        <InfoBox message={infoMessage} color={infoColor} />
      </div>
    </div>
  );
};

export default Goal;
