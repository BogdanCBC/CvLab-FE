import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Form, Input, Button, Checkbox, Typography, Alert } from 'antd';
import api from '../../api';
import './Login.scss';

const { Title, Text, Link } = Typography;

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      setInfoMessage('Your session has expired. Please log in again.');
    }
  }, []);

  const handleLogin = async ({ username, password }) => {
    setErrorMessage('');
    setInfoMessage('');
    setIsLoading(true);

    const formData = new URLSearchParams();
    formData.append('username', username.toLocaleLowerCase());
    formData.append('password', password);

    try {
      const response = await api.post('/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        validateStatus: () => true,
      });

      if (response.status === 200 && response.data.access_token && response.data.refresh_token) {
        const decoded = jwtDecode(response.data.access_token);
        localStorage.setItem('role', decoded.role);
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        localStorage.setItem('username', decoded.username || decoded.sub);
        localStorage.setItem('clientName', decoded.company_name);

        onLogin();
        navigate('/');
      } else if (response.status === 401 || response.status === 404) {
        setErrorMessage('Username or password is incorrect.');
      } else if (response.status === 429) {
        setErrorMessage('Too many login attempts. Please wait a moment and try again.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      setErrorMessage(`Login failed: ${error.message || 'Unexpected error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-wrap">
          <div className="background-patern"></div>
          <div className="login-logo" />
        </div>

        <Title level={3} className="login-title">
          Log in to your account
        </Title>
        <Text className="login-subtitle">
          Welcome back! Please enter your details.
        </Text>

        {infoMessage && (
          <Alert message={infoMessage} type="info" showIcon style={{ marginBottom: 20 }} />
        )}
        {errorMessage && (
          <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 20 }} />
        )}

        <Form form={form} layout="vertical" onFinish={handleLogin} requiredMark={false}>
          <Form.Item
            label={<span className="login-label">Email</span>}
            name="username"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input
              className="login-input"
              placeholder="Enter your email"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            label={<span className="login-label">Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              className="login-input"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </Form.Item>

          <div className="login-row">
            <Checkbox>
              <span style={{ fontSize: 14, color: '#414651', fontWeight: 500 }}>Remember me</span>
            </Checkbox>
            <Link className="login-forgot" onClick={() => navigate('/forgot-password')}>Forgot password</Link>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="default-button"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
