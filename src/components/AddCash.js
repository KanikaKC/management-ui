import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCash = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    source: '',
    sum: '',
    date: '',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailId = sessionStorage.getItem('emailId');
    const token = sessionStorage.getItem('token');

    const incomeData = {
      purpose: formData.source,
      sum: parseFloat(formData.sum),
      date: formData.date,
    };

    try {
      const response = await fetch("http://localhost:8080/income", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'User-Email': emailId,
        },
        body: JSON.stringify(incomeData),
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

      const result = await response.json();
      console.log('Income added successfully:', result);
      setFormData({
        source: '',
        sum: '',
        date: '',
      });
      setSuccess(true);

    } catch (error) {
      setError(error.message);
    } finally {
      setShowModal(true);
    }
  };

  return (
    <div>
      <div className="container mt-5 rounded-0" style={{ maxWidth: '600px' }}>
        <div className="card rounded 0">
          <div className="card-header bg-success text-white rounded-0">
            <h4>Add Income</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label htmlFor="sum" className="col-sm-2 col-form-label" style={{ fontSize: '14px' }}>Amount</label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control rounded-0"
                    id="sum"
                    name="sum"
                    placeholder="Enter amount"
                    value={formData.sum}
                    onChange={handleChange}
                    required
                    style={{ height: '30px', fontSize: '14px' }} // Adjusted height and font size
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label htmlFor="source" className="col-sm-2 col-form-label" style={{ fontSize: '14px' }}>Source</label>
                <div className="col-sm-10">
                  <input 
                    type="text"
                    className="form-control rounded-0"
                    id="source"
                    name="source"
                    placeholder="Enter source"
                    value={formData.source}
                    onChange={handleChange}
                    required
                    style={{ height: '30px', fontSize: '14px' }} // Adjusted height and font size
                  />
                </div>
              </div>

              <div className="row mb-3">
                <label htmlFor="date" className="col-sm-2 col-form-label" style={{ fontSize: '14px' }}>Date</label>
                <div className="col-sm-10">
                  <input
                    type="date"
                    className="form-control rounded-0"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    max={today}
                    required
                    style={{ height: '30px', fontSize: '14px' }} // Adjusted height and font size
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button type="submit" className="btn btn-success rounded-0" style={{ fontSize: '14px' }}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal for success/error feedback */}
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
                {error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <p>Income Added Successfully!</p>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ borderRadius: '0', backgroundColor: '#295d89', color: '#fff' }} 
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ source: '', sum: '', date: '' }); 
                    setError(null); 
                    setSuccess(false);
                  }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCash;
