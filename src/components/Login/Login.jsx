import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
    Box, Container, Card, Typography, TextField,
    Button, Alert, Divider, useTheme
} from '@mui/material';
import api from '../../api';
import './Login.css';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const theme = useTheme();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [expiredMessage, setExpiredMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('expired') === 'true') {
            setInfoMessage('Your session has expired. Please log in again.')
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setInfoMessage('');
        setIsLoading(true);

        const formData = new URLSearchParams();
        formData.append('username', username.toLocaleLowerCase());
        formData.append('password', password);

        try {
            const response = await api.post('/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                validateStatus: () => true
            });

            if (response.status === 200 && response.data.access_token && response.data.refresh_token) {
                const decoded = jwtDecode(response.data.access_token);
                localStorage.setItem('role', decoded.role);
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('refreshToken', response.data.refresh_token);

                const usernameValue = decoded.username || decoded.sub;
                const clientName = decoded.client_name;
                localStorage.setItem('username', usernameValue);
                localStorage.setItem('clientName', clientName);

                onLogin();
                navigate('/');
            } else if (response.status === 401 || response.status === 404) {
                setErrorMessage('Username or password is incorrect.');
            } else if (response.status === 429) {
                setErrorMessage('Too many login attempts. Please wait a moment and try again.')
            } else {
                setErrorMessage('An unexpected error occured. Please try again.')
            }
        } catch (error) {
            setErrorMessage(`Login failed: ${error.message || 'Unexpected error occurred'}`);
        } finally {
            setIsLoading(false);
        }
    }


  return (
      <Box
          sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f4f6f8',
              py: 4
          }}
      >
          <Container maxWidth="lg">
              <Card
                  sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      borderRadius: 3,
                      overflow: 'hidden'
                  }}
              >
                  {/* LEFT SIDE: LOGIN FORM */}
                  <Box sx={{ flex: 1, p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                          Welcome Back
                      </Typography>
                      <Typography variant="body1" color="text.secondary" mb={4}>
                          Please enter your credentials to access your account.
                      </Typography>

                      {infoMessage && <Alert severity="info" sx={{ mb: 3 }}>{infoMessage}</Alert>}
                      {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

                      <form onSubmit={handleLogin}>
                          <TextField
                              fullWidth
                              label="Username"
                              variant="outlined"
                              margin="normal"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                              autoComplete="username"
                          />
                          <TextField
                              fullWidth
                              label="Password"
                              type="password"
                              variant="outlined"
                              margin="normal"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              autoComplete="current-password"
                              sx={{ mb: 3 }}
                          />

                          <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              color="primary"
                              size="large"
                              disabled={isLoading}
                              sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                          >
                              {isLoading ? 'Signing in...' : 'Login'}
                          </Button>
                      </form>
                  </Box>

                  {/* RIGHT SIDE: APP DESCRIPTION */}
                  <Box
                      sx={{
                          flex: 1.2,
                          backgroundColor: 'primary.main',
                          color: 'white',
                          p: { xs: 4, md: 6 },
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                      }}
                  >
                      <Typography variant="h4" fontWeight="bold" gutterBottom>
                          Streamlined Recruitment
                      </Typography>
                      <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 4, lineHeight: 1.6 }}>
                          Our application transforms raw CVs and job descriptions into structured, actionable insights powered by AI.
                      </Typography>

                      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mb: 4 }} />

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <Box>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                  CV Management
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.6 }}>
                                  Upload PDFs to automatically extract and standardize candidate information into professional templates. Detect duplicates and export in multiple formats (English & French supported).
                              </Typography>
                          </Box>

                          <Box>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                  Job Descriptions
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.6 }}>
                                  Upload job descriptions to automatically extract required skills and calculate minimum experience levels required for each role.
                              </Typography>
                          </Box>

                          <Box>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                  Smart Matching
                              </Typography>
                              <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.6 }}>
                                  Instantly identify candidates who meet required skills and experience levels. Generate intelligent rankings and receive concise AI-driven summaries on fit.
                              </Typography>
                          </Box>
                      </Box>
                  </Box>

              </Card>
          </Container>
      </Box>
  );
}

export default Login;
