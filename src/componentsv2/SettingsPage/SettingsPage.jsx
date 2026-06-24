import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Upload, Avatar, message } from 'antd';
import { MailOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import './SettingsPage.scss';
import { UploadPhotoIcon } from "../../constants/icons";

const { Title, Text } = Typography;

const SettingsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username') || '';
        const storedRole = localStorage.getItem('role') || '';
        setUsername(storedUsername);
        setEmail(storedUsername);
        setRole(storedRole);
    }, []);

    const handleSave = async () => {
        if (newPassword && newPassword !== confirmPassword) {
            message.error(t('settingsPage.passwordMismatch', 'Passwords do not match'));
            return;
        }

        setLoading(true);
        try {
            if (currentPassword && newPassword) {
                await api.patch('/user/password', {
                    current_password: currentPassword,
                    new_password: newPassword,
                });
                message.success(t('settingsPage.passwordUpdated', 'Password updated successfully'));
            }
            message.success(t('settingsPage.saved', 'Settings saved successfully'));
            navigate('/profile');
        } catch (error) {
            message.error(t('settingsPage.saveError', 'Failed to save settings'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(t('settingsPage.imageOnly', 'You can only upload image files'));
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error(t('settingsPage.fileTooLarge', 'Image must be smaller than 2MB'));
            }
            if (isImage && isLt2M) {
                const url = URL.createObjectURL(file);
                setAvatarUrl(url);
            }
            return false;
        },
        showUploadList: false,
    };

    return (
        <div className="settings-page">
            <div className="settings-page__header">
                <Title level={3} className="settings-page__title">
                    {t('settingsPage.title', 'Settings')}
                </Title>
                <div className="settings-page__actions">
                    <Button className="default-grey-button" onClick={handleCancel} style={{height: '40px'}}>
                        {t('settingsPage.cancel', 'Cancel')}
                    </Button>
                    <Button type="primary" className="default-button small" loading={loading} onClick={handleSave}>
                        {t('settingsPage.save', 'Save')}
                    </Button>
                </div>
            </div>

            <div className="settings-page__section">
                <Title level={5} className="settings-page__section-title">
                    {t('settingsPage.personalInfo', 'Personal info')}
                </Title>
                <Text className="settings-page__section-subtitle">
                    {t('settingsPage.personalInfoDesc', 'Update your photo and personal details here.')}
                </Text>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.username', 'Username')}
                </label>
                <div className="settings-page__field">
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={t('settingsPage.usernamePlaceholder', 'Username')}
                    />
                </div>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.emailAddress', 'Email address')}
                </label>
                <div className="settings-page__field">
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        prefix={<MailOutlined style={{ color: '#A4A7AE' }} />}
                        placeholder={t('settingsPage.emailPlaceholder', 'email@example.com')}
                    />
                </div>
            </div>

            <div className="settings-page__row">
                <div className="settings-page__label-group">
                    <label className="settings-page__label">
                        {t('settingsPage.yourPhoto', 'Your photo')}
                    </label>
                    <Text className="settings-page__label-hint">
                        {t('settingsPage.photoHint', 'This will be displayed on your profile.')}
                    </Text>
                </div>
                <div className="settings-page__field settings-page__field--photo">
                    <Avatar size={64} src={avatarUrl} icon={!avatarUrl && <UserOutlined />} />
                    <Upload.Dragger {...uploadProps} className="settings-page__upload">
                        <p className="ant-upload-drag-icon">
                            <UploadPhotoIcon />
                        </p>
                        <p className="ant-upload-text">
                            <span className="settings-page__upload-link">
                                {t('settingsPage.clickToUpload', 'Click to upload')}
                            </span>
                            {' '}{t('settingsPage.orDragDrop', 'or drag and drop')}
                        </p>
                        <p className="ant-upload-hint">
                            {t('settingsPage.photoFormats', 'SVG, PNG, JPG or GIF (max. 800x400px)')}
                        </p>
                    </Upload.Dragger>
                </div>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.role', 'Role')}
                </label>
                <div className="settings-page__field">
                    <Input value={role} disabled />
                </div>
            </div>

            <div className="settings-page__section settings-page__section--password">
                <Title level={5} className="settings-page__section-title">
                    {t('settingsPage.password', 'Password')}
                </Title>
                <Text className="settings-page__section-subtitle">
                    {t('settingsPage.passwordDesc', 'Please enter your current password to change your password.')}
                </Text>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.currentPassword', 'Current password')}*
                </label>
                <div className="settings-page__field">
                    <Input.Password
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.newPassword', 'New password')}*
                </label>
                <div className="settings-page__field">
                    <Input.Password
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.confirmPassword', 'Confirm new password')}*
                </label>
                <div className="settings-page__field">
                    <Input.Password
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
