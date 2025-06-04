import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../../api';

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
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        validateStatus: () => true
      })

      if (response.status === 200 && response.data.access_token){
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        onLogin();
        navigate('/');
      } else if (response.status === 401) {
        alert('Username or password is incorrect.')
      } else {
        alert('Unexpected error occured.')
      }
    } catch (error) {
      alert('Login failed: '+ (error.message || 'Unexpected error occurred'));
    }
  };

  return (
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
  );
}

export default Login;
