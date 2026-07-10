import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import api from '../../api';
import './ForgotPassword.scss';

const { Title, Text } = Typography;

const STEPS = {
  EMAIL: 'email',
  VERIFY: 'verify',
  RESET: 'reset',
  SUCCESS: 'success',
};

function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);

  const handleForgotPassword = async ({ email: inputEmail }) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/forgot-password', { identifier: inputEmail }, {
        validateStatus: () => true,
      });

      if (response.status === 200) {
        setEmail(inputEmail);
        setStep(STEPS.VERIFY);
      } else if (response.status === 404) {
        setErrorMessage(t('forgotPassword.noAccount'));
      } else if (response.status === 429) {
        setErrorMessage(t('forgotPassword.tooManyRequests'));
      } else {
        setErrorMessage(t('forgotPassword.unexpectedError'));
      }
    } catch (error) {
      setErrorMessage(`${t('forgotPassword.requestFailed')}: ${error.message || t('forgotPassword.unexpectedError')}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((d, i) => {
        if (index + i < 6) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    setErrorMessage('');
    const codeString = code.join('');

    if (codeString.length !== 6) {
      setErrorMessage(t('forgotPassword.codeIncomplete'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/verify-reset-code', {
        identifier: email,
        code: codeString,
      }, {
        validateStatus: () => true,
      });

      if (response.status === 200) {
        setResetToken(response.data.reset_token);
        setStep(STEPS.RESET);
      } else if (response.status === 400) {
        setErrorMessage(t('forgotPassword.codeInvalid'));
      } else if (response.status === 429) {
        setErrorMessage(t('forgotPassword.tooManyAttempts'));
      } else {
        setErrorMessage(t('forgotPassword.unexpectedError'));
      }
    } catch (error) {
      setErrorMessage(`${t('forgotPassword.verificationFailed')}: ${error.message || t('forgotPassword.unexpectedError')}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async ({ newPassword, confirmPassword }) => {
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage(t('forgotPassword.passwordMismatch'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/reset-password', {
        reset_token: resetToken,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }, {
        validateStatus: () => true,
      });

      if (response.status === 200) {
        setStep(STEPS.SUCCESS);
      } else if (response.status === 400) {
        setErrorMessage(t('forgotPassword.resetRequestInvalid'));
      } else {
        setErrorMessage(t('forgotPassword.unexpectedError'));
      }
    } catch (error) {
      setErrorMessage(`${t('forgotPassword.resetFailed')}: ${error.message || t('forgotPassword.unexpectedError')}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <Title level={3} className="forgot-title">{t('forgotPassword.title')}</Title>
      <Text className="forgot-subtitle">{t('forgotPassword.subtitle')}</Text>

      {errorMessage && (
        <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 20 }} />
      )}

      <Form form={form} layout="vertical" onFinish={handleForgotPassword} requiredMark={false}>
        <Form.Item
          label={<span className="forgot-label">{t('forgotPassword.emailLabel')}</span>}
          name="email"
          rules={[
            { required: true, message: t('forgotPassword.emailRequired') },
            { type: 'email', message: t('forgotPassword.emailInvalid') },
          ]}
        >
          <Input
            className="forgot-input"
            placeholder={t('forgotPassword.emailPlaceholder')}
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
            className="default-button"
          >
            {t('forgotPassword.sendBtn')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );

  const renderVerifyStep = () => (
    <>
      <Title level={3} className="forgot-title">{t('forgotPassword.verifyTitle')}</Title>
      <Text className="forgot-subtitle">{t('forgotPassword.verifySubtitle')}</Text>

      {errorMessage && (
        <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 20 }} />
      )}

      <div className="code-label">{t('forgotPassword.secureCode')}</div>
      <div className="code-inputs">
        {code.map((digit, index) => (
          <div key={index} className="code-digit-wrapper">
            <input
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={e => handleCodeChange(index, e.target.value)}
              onKeyDown={e => handleCodeKeyDown(index, e)}
              className="code-digit"
            />
            {index === 2 && <span className="code-dash">–</span>}
          </div>
        ))}
      </div>

      <Button
        type="primary"
        block
        loading={isLoading}
        className="default-button"
        onClick={handleVerifyCode}
      >
        {t('forgotPassword.verifyBtn')}
      </Button>
    </>
  );

  const renderResetStep = () => (
    <>
      <Title level={3} className="forgot-title">{t('forgotPassword.resetTitle')}</Title>
      <Text className="forgot-subtitle">{t('forgotPassword.resetSubtitle')}</Text>

      {errorMessage && (
        <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 20 }} />
      )}

      <Form layout="vertical" onFinish={handleResetPassword} requiredMark={false}>
        <Form.Item
          label={<span className="forgot-label">{t('forgotPassword.newPassword')}</span>}
          name="newPassword"
          rules={[
            { required: true, message: t('forgotPassword.newPasswordRequired') },
            { min: 8, message: t('forgotPassword.passwordMinLength') },
          ]}
        >
          <Input.Password
            className="forgot-input"
            placeholder={t('forgotPassword.newPasswordPlaceholder')}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label={<span className="forgot-label">{t('forgotPassword.confirmPassword')}</span>}
          name="confirmPassword"
          rules={[
            { required: true, message: t('forgotPassword.confirmPasswordRequired') },
          ]}
        >
          <Input.Password
            className="forgot-input"
            placeholder={t('forgotPassword.confirmPasswordPlaceholder')}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
            className="default-button"
          >
            {t('forgotPassword.resetBtn')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <div className="success-icon-wrap">
        <CheckCircleOutlined className="success-icon" />
      </div>
      <Title level={3} className="forgot-title">{t('forgotPassword.successTitle')}</Title>
      <Text className="forgot-subtitle">{t('forgotPassword.successSubtitle')}</Text>

      <Button
        type="primary"
        block
        className="default-button"
        onClick={() => navigate('/login')}
      >
        {t('forgotPassword.backToLogin')}
      </Button>
    </>
  );

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-wrap">
          <div className="background-patern"></div>
          {step !== STEPS.SUCCESS && <div className="login-logo" />}
        </div>

        {step === STEPS.EMAIL && renderEmailStep()}
        {step === STEPS.VERIFY && renderVerifyStep()}
        {step === STEPS.RESET && renderResetStep()}
        {step === STEPS.SUCCESS && renderSuccessStep()}
      </div>
    </div>
  );
}

export default ForgotPassword;
