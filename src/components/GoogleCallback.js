import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      // Send the authorization code to your backend
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        const response = await fetch("http://localhost:8080/oauth2/callback/google", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }), // Send the authorization code
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.token; 
          const username = data.data.username; 
          
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('loggedIn', 'true');
          sessionStorage.setItem('emailId', data.data.emailId);
          sessionStorage.setItem('username', username);

          navigate("/app/add-expense", { replace: true }); 
        } else {
          alert("Failed to log in with Google.");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
