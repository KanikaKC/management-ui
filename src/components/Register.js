import React, { useState } from 'react';
import './Register.css';
import { Button } from 'primereact/button';
import "primereact/resources/themes/nano/theme.css";
import { useNavigate, Link } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const [inputStates, setInputStates] = useState({
    name: false,
    email: false,
    password: false,
    phoneNumber: false,
    address: false,
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setInputStates(prevStates => ({
      ...prevStates,
      [id]: value.length > 0
    }));
  };

  const handleBlur = async (event) => {
    const { id, value } = event.target;
    setInputStates(prevStates => ({
      ...prevStates,
      [id]: false
    }));

    // Validate phone number on blur
    if (id === 'phoneNumber' && value) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        setError('Phone number must be exactly 10 digits');
        setShowModal(true);
      } else {
        setError(null);
      }
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const sendData = {
      username: data.get("name"),
      emailId: data.get("email"),
      password: data.get("password"),
      phoneNumber: data.get("phoneNumber"),
      address: data.get("address"),
    };

    // Final validation before submission
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(sendData.phoneNumber)) {
      setError('Phone number must be exactly 10 digits');
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/user/register", {
        method: "POST",
        body: JSON.stringify(sendData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to register user');
      } else {
        setShowModal(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
      setShowModal(true);
    }
  };



  return (
    <div className="background-container" >
    <div className="addUser">
      <h3>Register Your BOSCH ID</h3>
      <form className="addUserForm" onSubmit={handleFormSubmit}>
        <div className="inputGroup">
          <label htmlFor="name">UserName</label>
          <input type="text" 
            id="name" 
            name="name"
            autoComplete="off" 
            className={inputStates.name ? 'active' : ''}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <label htmlFor="email">Email address</label>
          <input type="email" 
            id="email"
            name="email"
            autoComplete="off" 
            className={inputStates.email ? 'active' : ''}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <label htmlFor="phoneNumber">Phone Number</label>
          <input type="text" 
            id="phoneNumber"
            name="phoneNumber"
            autoComplete="off" 
            className={inputStates.phoneNumber ? 'active' : ''}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <label htmlFor="address">Address</label>
          <input type="text" 
            id="address"
            name="address"
            autoComplete="off" 
            className={inputStates.address ? 'active' : ''}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <label htmlFor="password">Password</label>
          <input type="password" 
            id="password" 
            name="password"
            autoComplete="off" 
            className={inputStates.password ? 'active' : ''}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <Button type="submit" label="Register"></Button>
        </div>
        <div className="login">
          <p>Already have an account? <Link to="/">Login</Link></p>
        </div>
      </form>
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
                <p>User Registered Successfully!</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" 
                style={{ borderRadius: '0', backgroundColor: '#295d89', color: '#fff' }}
                onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Register;
