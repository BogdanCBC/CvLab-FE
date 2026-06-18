import React, { useState } from 'react';
import { Modal, Button, Alert, Typography } from 'antd';
import api from '../../api';
import PasswordField from './PasswordField';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const ResetPasswordModal = ({ open, onClose, targetUser }) => {
    const { t } = useTranslation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleReset = async () => {
        setErrorMsg('');
        try {
            await api.patch('/user/password', {
                username: targetUser.username,
                new_password: newPassword
            });
            setSuccess(true);
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2500);
        } catch (error) {
            const detail = error.response?.data?.detail;
            const message = typeof detail === 'string' ? detail : JSON.stringify(detail);
            setErrorMsg(message || t("resetPassword.errMsg"));
        }
    };

    const passwordsMatch = newPassword === confirmPassword && newPassword !== '';
    const isLengthValid = newPassword.length >= 8;
    const isButtonDisabled = !passwordsMatch || !isLengthValid || success;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={t("resetPassword.resetPass")}
            footer={null}
        >
            {success && (
                <Alert
                    message={t("resetPassword.successMsg")}
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}
            {errorMsg && (
                <Alert
                    message={errorMsg}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                {t("resetPassword.changingFor")} <strong>{targetUser?.username}</strong>
            </Text>

            <PasswordField
                label={t("resetPassword.newPassword")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />

            <PasswordField
                label={t("resetPassword.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword !== '' && !passwordsMatch}
                helperText={confirmPassword !== '' && !passwordsMatch ? "Passwords do not match" : ""}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Button
                    className="filled-btn"
                    block
                    onClick={onClose}
                    disabled={success}
                >
                    {t("resetPassword.cancel")}
                </Button>
                <Button
                    type="primary"
                    className="default-button small"
                    block
                    onClick={handleReset}
                    disabled={isButtonDisabled}
                >
                    {t("resetPassword.saveChanges")}
                </Button>
            </div>
        </Modal>
    );
};

export default ResetPasswordModal;
