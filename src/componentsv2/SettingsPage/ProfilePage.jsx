import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Avatar } from 'antd';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import './SettingsPage.scss';

const { Title } = Typography;

const ProfilePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/user/me');
                const data = response.data;
                setUsername(data.username || '');
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setEmail(data.email || '');
                setRole(data.role || '');
                setAvatarUrl(data.profile_image_url || null);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };
        fetchProfile();
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
                    {t('settingsPage.username', 'Username')}
                </label>
                <div className="settings-page__field">
                    <Input value={username} disabled />
                </div>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.firstName', 'First name')}
                </label>
                <div className="settings-page__field">
                    <Input value={firstName} disabled />
                </div>
            </div>

            <div className="settings-page__row">
                <label className="settings-page__label">
                    {t('settingsPage.lastName', 'Last name')}
                </label>
                <div className="settings-page__field">
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
