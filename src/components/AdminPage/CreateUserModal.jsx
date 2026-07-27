import React, { useState } from 'react';
import { Modal, Input, Button, Select, Alert, Space } from 'antd';
import api from '../../api';
import { useTranslation } from "react-i18next";

const CreateUserModal = ({ open, onClose, onUserCreated }) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'demo' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async () => {
        setErrorMsg('');
        try {
            await api.post('/user', formData);
            setSuccess(true);
            onUserCreated();
            setTimeout(() => {
                setSuccess(false);
                onClose();
                setFormData({ username: '', email: '', password: '', role: 'hr' });
                setConfirmPassword('');
            }, 2500);
        } catch (error) {
            const detail = error.response?.data?.detail;
            setErrorMsg(typeof detail === 'string' ? detail : JSON.stringify(detail) || "Error creating user");
        }
    };

    const passwordsMatch = formData.password === confirmPassword && formData.password !== '';
    const isLengthValid = formData.password.length >= 8;
    const isUsernameValid = formData.username.trim() !== '';
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const isButtonDisabled = !passwordsMatch || !isLengthValid || !isUsernameValid || !isEmailValid || success;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title={t("createUserModal.createNewAcc")}
        >
            {success && (
                <Alert
                    message={t("createUserModal.createdMsg")}
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

            <Space orientation="vertical" style={{ width: '100%' }} size="middle">
                <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>{t("createUserModal.username")}</label>
                    <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>{t("createUserModal.email")}</label>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>{t("createUserModal.password")}</label>
                    <Input.Password
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>{t("createUserModal.confirmPass")}</label>
                    <Input.Password
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        status={confirmPassword !== '' && !passwordsMatch ? 'error' : ''}
                    />
                    {confirmPassword !== '' && !passwordsMatch && (
                        <span style={{ color: '#ff4d4f', fontSize: 12 }}>Passwords do not match</span>
                    )}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>{t("createUserModal.role")}</label>
                    <Select
                        value={formData.role}
                        onChange={(value) => setFormData({ ...formData, role: value })}
                        style={{ width: '100%' }}
                        options={[
                            { value: 'admin', label: t("createUserModal.admin") },
                            { value: 'hr', label: t("createUserModal.hr") },
                            { value: 'demo', label: t("createUserModal.demo") },
                        ]}
                    />
                </div>

                <Button
                    type="primary"
                    className="default-button small"
                    block
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                >
                    {t("createUserModal.createUser")}
                </Button>
            </Space>
        </Modal>
    );
};

export default CreateUserModal;
