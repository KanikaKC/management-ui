import React, { useEffect, useState } from 'react';
import './Transaction.css';
import editIcon from './Assets/edit-text.png'; 
import deleteIcon from './Assets/trash.png'; 
import ExportExcel from './ExportExcel';
import pdfIcon from './Assets/pdf.png'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const [maxRows, setMaxRows] = useState(0);
  const [inputRows, setInputRows] = useState('');
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({});

  const categories = [
    'FOOD_AND_DRINK',
    'SHOPPING',
    'BILLS_AND_UTILITY',
    'OTHERS',
    'REVENUE',
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      const userEmail = sessionStorage.getItem('emailId');

      if (!userEmail) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/transactions?userEmail=${encodeURIComponent(userEmail)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data.data);
        setMaxRows(data.data.length);
        setRowsPerPage(data.data.length);
        setInputRows(data.data.length.toString());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/delete-transaction?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete transaction');
      }

      setTransactions((prevTransactions) => prevTransactions.filter(transaction => transaction.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransactionId(transaction.id);
    setEditedTransaction({
      ...transaction,
      date: transaction.date.split('T')[0] // Ensure date is in YYYY-MM-DD format
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Check the category and adjust the sum accordingly before saving
      const adjustedSum = editedTransaction.category !== 'REVENUE'
        ? Math.abs(editedTransaction.sum) * -1 // Negate the value for non-revenue categories
        : Math.abs(editedTransaction.sum);

      const updatedTransaction = { ...editedTransaction, sum: adjustedSum };

      const response = await fetch(`http://localhost:8080/update-transaction/${updatedTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'User-Email': sessionStorage.getItem('emailId'),
        },
        body: JSON.stringify(updatedTransaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update transaction');
      }

      const newTransaction = await response.json();
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === newTransaction.data.id ? newTransaction.data : transaction
        )
      );
      setEditingTransactionId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRowsChange = (e) => {
    setInputRows(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const value = Number(inputRows);
      if (value > 0 && value <= maxRows) {
        setRowsPerPage(value);
      } else {
        setRowsPerPage(maxRows);
      }
      setInputRows('');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Purpose", "Category", "Amount", "Date"];
    const tableRows = [];

    const displayedTransactions = transactions.slice(0, rowsPerPage);

    displayedTransactions.forEach(transaction => {
      const transactionData = [
        transaction.purpose,
        transaction.category,
        transaction.sum,
        transaction.date.split('T')[0] // Formatting date
      ];
      tableRows.push(transactionData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Transactions", 14, 15);
    doc.save("transactions.pdf");
  };

  if (loading) {
    return <div style={{ textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const displayedTransactions = transactions.slice(0, rowsPerPage);

  return (
    <div>
      <ExportExcel />
      <button className="pdf" onClick={exportToPDF}>
        <img src={pdfIcon} alt="export Icon" style={{ width: '23px', height: '22px' }} />
        <span> Export</span>
      </button>
      <div className="container mt-1 radius-0" style={{ maxWidth: '700px' }}>
        <div className="header-background d-flex justify-content-between align-items-center mb-3 p-3">
          <h6 className="text-white">Recent Transactions</h6>
          <div>
            <label htmlFor="rowsPerPage" className="me-2">Select Rows</label>
            <input
              type="number"
              id="rowsPerPage"
              value={inputRows}
              onChange={handleRowsChange}
              onKeyPress={handleKeyPress}
              min="1"
              max={maxRows}
              className="form-control"
              style={{ width: '80px', display: 'inline-block' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table table-bordered" style={{ fontFamily: 'Arial, Bosch Office Sans, Helvetica, sans-serif', margin: '0px' }}>
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((transaction, index) => (
                <tr key={transaction.id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff' }}>
                  {editingTransactionId === transaction.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="purpose"
                          value={editedTransaction.purpose || ''}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <select
                          name="category"
                          value={editedTransaction.category || ''}
                          onChange={handleChange}
                          className="form-control">
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          name="sum"
                          value={editedTransaction.sum || ''}
                          onChange={handleChange}
                          className="form-control"
                          style={{ color: editedTransaction.category !== 'REVENUE' ? 'red' : 'green' }}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="date"
                          value={editedTransaction.date || ''}
                          onChange={handleChange}
                          className="form-control"
                          max={new Date().toISOString().split('T')[0]} // Restrict date selection to today
                        />
                      </td>
                      <td>
                        <div className="d-flex">
                          <button onClick={handleSave} className="btn btn-success me-1 rounded-0">Save</button>
                          <button onClick={() => setEditingTransactionId(null)} className="btn btn-secondary rounded-0">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="table-cell">{transaction.purpose}</td>
                      <td>
                        <span className={`category-label ${transaction.sum < 0 ? 'negative' : ''}`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="table-cell" style={{ color: transaction.sum < 0 ? 'red' : 'green' }}>
                        {transaction.sum}
                      </td>
                      <td className="table-cell">{transaction.date.split('T')[0]}</td>
                      <td className="table-cell">
                        <button 
                          onClick={() => handleEdit(transaction)} 
                          className="btn btn-link btn-edit me-2" 
                          data-sbtip="Edit"
                          style={{ position: 'relative' }}
                        >
                          <img src={editIcon} alt="Edit" style={{ width: '20px', height: '20px' }} />
                        </button>
                        <button 
                          onClick={() => handleDelete(transaction.id)} 
                          className="btn btn-link btn-delete me-2" 
                          data-sbtip="Delete"
                          style={{ position: 'relative' }}
                        >
                          <img src={deleteIcon} alt="Delete" style={{ width: '20px', height: '20px' }} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
