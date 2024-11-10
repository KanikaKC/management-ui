import React, { useEffect, useState } from 'react';
import './LoginForm.css'; 
import { Button } from 'primereact/button'; 
import { Link, useNavigate } from 'react-router-dom';
import logo from '../components/Assets/bosch_logo.png'; 
import googleIcon from '../components/Assets/google.png';
import githubIcon from '../components/Assets/github.png'; 
import { useUser } from './UserContext';
import { useTheme } from './ThemeContext';

const LoginForm = () => {
  const { setUserDetails } = useUser();
  const { theme } = useTheme(); // Get current theme
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const emailId = sessionStorage.getItem('emailId');
    if (emailId) {
      navigate('/app/add-expense');
    }
  }, [navigate]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const sendData = { emailId: email, password };

    try {
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        body: JSON.stringify(sendData),
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        const message = response.status === 401
          ? "Unauthorized. Please check your credentials."
          : "Login failed. Please try again.";
        alert(message);
        return;
      }

      const responseData = await response.json();
      const { token, data: { username } } = responseData;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('emailId', email);
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('profilePic', responseData.data.profilePic);

      console.log(responseData);

      setUserDetails({ email, username });
      navigate("/app/add-expense", { replace: true });
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleOAuthLogin = (provider) => {
    console.log("Attempting to login with:", provider);
    const urlMap = {
      github: "http://localhost:8000/oauth2/authorization/github",
      google: "http://localhost:8080/oauth2/authorization/google"
    };
    window.location.href = urlMap[provider];
  };

  return (
    <div className="background-container" >
      <div className="login-container">
        <div className="boschLogo">
          <img src={logo} alt="Bosch Logo" className="bosch-logo" />
          <h1 className="loginheading">Login</h1>
          <p className="login-text">Please login here:</p>
          <form className="addLoginForm" onSubmit={handleFormSubmit}>
            <div className="loginGroup">
              <div className="row mb-3">
                <label htmlFor="email" className="col-sm-2 col-form-label">Email:</label>
                <div className="col-sm-10">
                  <input
                    className="form-control-login rounded-0"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="password" className="col-sm-2 col-form-label">Password:</label>
                <div className="col-sm-10">
                  <input 
                    className="form-control-login rounded-0"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" label="Login" style={{backgroundColor:'#0f68ad', color:'white', border:'none'}}/>
              <div className="signup">
                <p>Don't have an account? <Link to="/signup">Register</Link></p>
              </div>
            </div>
          </form>
          <div className="social-login">
            <p>Or register with:</p>
            <div style={{ marginBottom: '10px' }}>
              <Button className="github-btn" onClick={() => handleOAuthLogin('github')}>
                <img src={githubIcon} alt="GitHub" style={{ width: '20px', marginRight: '8px' }} />
                GitHub
              </Button>
            </div>
            <div>
              <Button className="google-btn" onClick={() => handleOAuthLogin('google')}>
                <img src={googleIcon} alt="Google" style={{ width: '20px', marginRight: '8px' }} />
                Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
};

export default LoginForm;
