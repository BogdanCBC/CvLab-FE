import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../api';
import './Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [expiredMessage, setExpiredMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      setExpiredMessage('Your session has expired. Please log in again.');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('username', username.toLocaleLowerCase());
    formData.append('password', password);

    try {
      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        validateStatus: () => true
      })

      if (response.status === 200 && response.data.access_token && response.data.refresh_token){
        const decoded = jwtDecode(response.data.access_token);
        localStorage.setItem('role', decoded.role);
        
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        onLogin();
        navigate('/');
      } else if (response.status === 401 || response.status === 404) {
        alert('Username or password is incorrect.')
      } else {
        alert('Uexpected error occured')
      }
    
    } catch (error) {
      alert('Login failed: '+ (error.message || 'Unexpected error occurred'));
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <h2>Login</h2>
        {expiredMessage && <p style={{ color: 'red' }}>{expiredMessage}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username:</label><br />
            <input
              type="text"
              id="username"
              value={username}
              placeholder='Enter your username...'
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label><br />
            <input
              type="password"
              id="password"
              value={password}
              placeholder='Enter your password...'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>

      <div className='instructions-container'>
        <h3>App description</h3>
        <h4>Our application streamlines recruitment by transforming raw CVs and job descriptions into structured, actionable insights.</h4>
        <ul>
          <li><b>CV Management:</b> Upload CVs in PDF format, and our AI automatically extracts candidate information and standardizes it into professional templates. Candidate details are displayed in an editable table, where you can review, update, and export either the original CV or a formatted version in the available templates. The app supports both English and French, and it detects duplicate CVs to keep your database clean.</li>
          <li><b>Job Description Management:</b> Upload job descriptions, which are displayed in a clear table format. Our AI extracts the required skills and minimum years of experience for each skill.</li>
          <li><b>Smart Matching & Ranking:</b> For every job description, the app identifies candidates who meet the required skills and experience levels. You can view available matches, generate candidate rankings, and even receive a concise summary explaining whether each candidate is a strong fit for the role.</li>   
        </ul>
      </div>
    </div>
  );
}

export default Login;
