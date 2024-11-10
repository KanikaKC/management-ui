import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Balance from "./Balance";
import ExpenseChart from './ExpenseChart';

const AddExpense = () => {
  const [purpose, setPurpose] = useState("");
  const [sum, setSum] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [billsImage, setBillsImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0); // Track total income
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("purpose", purpose);
    formData.append("sum", sum);
    formData.append("date", date);
    formData.append("category", category);
    if (billsImage) {
      formData.append("billsImage", billsImage);
    }

    const emailId = sessionStorage.getItem('emailId'); 
    const token = sessionStorage.getItem('token');

    try {
      const response = await fetch("http://localhost:8080/expenses", {
        method: 'POST',
        headers: {
          'User-Email': emailId,
          'Authorization': `Bearer ${token}`
        },
        body: formData,
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

      setSuccess(true);
      setPurpose("");
      setSum("");
      setDate("");
      setCategory("");
      setBillsImage(null);
      document.getElementById("billsImage").value = ""; 
      fetchChartData(); 
      fetchTotalIncome(); // Fetch total income after adding an expense
    } catch (error) {
      setError(error.message);
    } finally {
      setShowModal(true);
    }
  };

  const fetchChartData = async () => {
    const userEmail = sessionStorage.getItem('emailId');

    if (!userEmail) {
      setError('User not logged in');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/transactions?userEmail=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const transactions = result.data;
          const incomeData = transactions.filter(entry => entry.sum > 0);
          const expenseData = transactions.filter(entry => entry.sum < 0);
          setIncomeData(incomeData);
          setExpenseData(expenseData);
        } else {
          setError('Invalid data format received from the server');
        }
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (error) {
      setError('An error occurred while fetching data');
    }
  };

  const fetchTotalIncome = async () => {
    const userEmail = sessionStorage.getItem('emailId');

    if (!userEmail) {
      setError('User not logged in');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/total-income?userEmail=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const incomeResult = await response.json();
        setTotalIncome(incomeResult.totalIncome || 0); // Assuming the response contains a totalIncome field
      } else {
        setError('Failed to fetch total income');
      }
    } catch (error) {
      setError('An error occurred while fetching total income');
    }
  };

  useEffect(() => {
    fetchTotalIncome(); // Fetch total income on component mount
    fetchChartData();   // Fetch chart data
  }, []);

  return (
    <div>
      <h4>Total Income: ${totalIncome.toFixed(2)}</h4> {/* Display total income */}
      <ExpenseChart incomeData={incomeData} expenseData={expenseData} />
      {totalIncome > 0 && <Balance />} {/* Show Balance only if totalIncome is greater than 0 */}
      <div className="container rounded-0" style={{ maxWidth: '600px' }}>
        <div className="card rounded-0">
          <div className="card-header text-white rounded-0" style={{ backgroundColor: 'rgba(252, 86, 26, 0.708)' }}>
            <h4>Add Expense</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label htmlFor="sum" className="col-sm-2 col-form-label" style={{ fontSize: '14px' }}>Amount</label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control rounded-0"
                    style={{ height: '30px', fontSize: '14px' }} // Adjusted height and font size
                    id="sum"
                    value={sum}
                    placeholder="Enter amount"
                    onChange={(e) => setSum(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="purpose" className="col-sm-2 col-form-label" style={{ fontSize: '14px' }}>Purpose</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control rounded-0"
                    style={{ height: '30px', fontSize: '14px' }} // Adjusted height and font size
                    id="purpose"
                    value={purpose}
                    placeholder="Enter purpose"
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="date" className="col-sm-2 col-form-label" style={{ fontSize: '14px' }}>Date</label>
                <div className="col-sm-10">
                  <input
                    type="date"
                    className="form-control rounded-0"
                    style={{ height: '30px', fontSize: '14px' }} // Adjusted height and font size
                    id="date"
                    value={date}
                    max={today}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="billsImage" className="col-sm-2 col-form-label" style={{ fontSize: '14px' }}>Invoice</label>
                <div className="col-sm-10">
                  <input
                    type="file"
                    className="form-control rounded-0"
                    style={{ height: '30px', fontSize: '14px' }} // Adjusted height and font size
                    id="billsImage"
                    accept="image/*"
                    onChange={(e) => setBillsImage(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="form-group mb-3">
                <label style={{ fontSize: '14px' }}>Category</label>
                <div className="d-flex justify-content-around mt-2" style={{ fontSize: '14px' }}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="category"
                      id="food"
                      value="FOOD_AND_DRINK"
                      checked={category === "FOOD_AND_DRINK"}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                    <label className="form-check-label" htmlFor="food">🍴 Food and Drink</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="category"
                      id="shopping"
                      value="SHOPPING"
                      checked={category === "SHOPPING"}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                    <label className="form-check-label" htmlFor="shopping">🛒 Shopping</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="category"
                      id="home"
                      value="BILLS_AND_UTILITY"
                      checked={category === "BILLS_AND_UTILITY"}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                    <label className="form-check-label" htmlFor="home">🏡 Bills & Utility</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="category"
                      id="other"
                      value="OTHERS"
                      checked={category === "OTHERS"}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                    <label className="form-check-label" htmlFor="other">🔄 Others</label>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn" style={{ backgroundColor: 'rgba(252, 86, 26, 0.708)', color: 'white' }}>Add Expense</button>
              </div>
            </form>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {success && <div className="alert alert-success mt-3">Expense added successfully!</div>}
          </div>
        </div>
      </div>
      <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content" style={{ borderRadius: '0' }}>
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="modal-title">{error ? 'Error' : 'Success'}</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {error ? <div className="alert alert-danger">{error}</div> : <p>Expenditure Added Successfully!</p>}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                style={{ borderRadius: '0', backgroundColor: '#295d89', color: '#fff' }}
                onClick={() => {
                  setShowModal(false);
                  setPurpose("");
                  setSum("");
                  setDate("");
                  setCategory("");
                  setBillsImage(null);
                  document.getElementById("billsImage").value = "";
                  setError(null);
                  setSuccess(false);
                }}> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
