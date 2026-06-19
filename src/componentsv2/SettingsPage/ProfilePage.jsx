import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Avatar } from 'antd';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SettingsPage.scss';

const { Title } = Typography;

const ProfilePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [avatarUrl] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username') || '';
        const storedRole = localStorage.getItem('role') || '';
        const nameParts = storedUsername.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setEmail(storedUsername);
        setRole(storedRole);
    }, []);

    return (
        <div className="settings-page">
            <div className="settings-page__header">
                <Title level={3} className="settings-page__title">
                    {t('profilePage.title', 'Profile')}
                </Title>
                <div className="settings-page__actions">
                    <Button type="primary" className="default-button small" onClick={() => navigate('/settings')}>
                        {t('profilePage.edit', 'Edit')}
                    </Button>
                </div>
            </div>

            <div className="settings-page__section">
                <Title level={5} className="settings-page__section-title">
                    {t('settingsPage.personalInfo', 'Personal info')}
                </Title>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.name', 'Name')}
                </label>
                <div className="settings-page__field settings-page__field--double">
                    <Input value={firstName} disabled />
                    <Input value={lastName} disabled />
                </div>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.emailAddress', 'Email address')}
                </label>
                <div className="settings-page__field">
                    <Input
                        value={email}
                        disabled
                        prefix={<MailOutlined style={{ color: '#A4A7AE' }} />}
                    />
                </div>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.yourPhoto', 'Your photo')}
                </label>
                <div className="settings-page__field settings-page__field--photo-view">
                    <Avatar size={64} src={avatarUrl} icon={!avatarUrl && <UserOutlined />} />
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
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.currentPassword', 'Current password')}*
                </label>
                <div className="settings-page__field">
                    <Input.Password value="••••••••" disabled />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
