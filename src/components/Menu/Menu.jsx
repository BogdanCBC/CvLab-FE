import React, {useEffect, useState} from 'react';
import './Menu.scss';
import { useNavigate, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { Button, Tooltip, Popover, Avatar, Badge } from 'antd';
import LogoIcon from '../../images/Logomark-small.svg';

import { UserOutlined } from '@ant-design/icons';
import { CvIcon, CvIconActive, CompaniesIcon, CompaniesIconActive, SettingOutlined, Settings, SettingsActive, InfoIconMenu, LogoutIconMenu, ProfileIcon } from "../../constants/icons";
import { useActivePage, PAGES } from '../../store/activePageStore';
import { useUser } from '../../store/userStore';


function Menu(props) {
    const {t } = useTranslation();
    const userRole = localStorage.getItem('role');
    const { setActivePage } = useActivePage();
    const { user, fetchUser } = useUser();
    const { pathname } = useLocation();

    const [settingsOpen, setSettingsOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    function handleLogout() {
        localStorage.clear();
        props.setIsLoggedIn(false);
        navigate('/login');
    }

    // const handleNavigateJob = () => {
    //     setActivePage(PAGES.JOB_DESCRIPTION);
    //     navigate('/job-description');
    // }

    const handleNavigateAdmin = () => {
        setActivePage(PAGES.ADMIN);
        navigate('/admin');
    };

    const handleNavigateCompanies = () => {
        setActivePage(PAGES.COMPANIES);
        navigate('/companies');
    };

    const handleNavigateCv = () => {
        setActivePage(PAGES.CV);
        navigate('/candidates');
    }

    return (
        <div className="menu">
            <div className="top">
                <div className="logo-wrapper">
                    <img src={LogoIcon} alt='logo' style={{ maxHeight: '80px' }} />
                </div>
                <Tooltip title={t('topbar.candidate_cv')} placement="right">
                    <Button className={`icon-button ${pathname === "/candidates" ? "active" : ""}`} type="primary" icon={pathname === "/candidates" ? <CvIconActive /> : <CvIcon />} onClick={handleNavigateCv}/>
                </Tooltip>
                {/* <Tooltip title={t('topbar.job_desc')}>
                    <Button className={`icon-button ${pathname === "/job-description" ? "active" : ""}`} type="primary" icon={pathname === "/job-description" ? <JobIconActive /> : <JobIcon />} onClick={handleNavigateJob}/>
                </Tooltip> */}
                <Tooltip title={t('topbar.companies', 'Companies')} placement="right">
                    <Button className={`icon-button ${pathname === "/companies" ? "active" : ""}`} type="primary" icon={pathname === "/companies" ? <CompaniesIconActive /> : <CompaniesIcon />} onClick={handleNavigateCompanies}/>
                </Tooltip>
                {(userRole === 'admin' || userRole === 'superadmin') && (
                <Tooltip title={t('topbar.admin')} placement="right">
                    <Button className={`icon-button ${pathname === "/admin" ? "active" : ""}`} type="primary" icon={pathname === "/admin" ? <UserOutlined style={{color : '#717680'}}/> : <UserOutlined style={{color : '#A4A7AE'}}/>} onClick={handleNavigateAdmin}/>
                </Tooltip>
                )}
            </div>
            <div className="bottom">
                <Tooltip title={t('topbar.settings')} placement="right">
                    <Button className={`icon-button ${pathname === "/settings" ? "active" : ""}`} type="primary" icon={pathname === "/settings" ? <SettingsActive /> : <Settings />} onClick={() => navigate('/settings')} />
                </Tooltip>
                <Popover
                    content={
                        <div className="settings-popover">
                            <div className="settings-popover-item" onClick={() => { setSettingsOpen(false); navigate('/profile'); }}>
                                <ProfileIcon />
                                <span>{t('topbar.viewProfile')}</span>
                            </div>
                            <div className="settings-popover-item" onClick={() => { setSettingsOpen(false); navigate('/settings'); }}>
                                <SettingOutlined />
                                <span>{t('topbar.settings')}</span>
                            </div>
                            <div className="settings-popover-item" onClick={() => { setSettingsOpen(false); }}>
                                <InfoIconMenu />
                                <span>{t('topbar.info')}</span>
                            </div>
                            <div className="settings-popover-item" onClick={() => { setSettingsOpen(false); handleLogout(); }}>
                                <LogoutIconMenu />
                                <span>{t('topbar.logout')}</span>
                            </div>
                        </div>
                    }
                    trigger="click"
                    placement="right"
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                    arrow={false}
                >
                    <Badge dot color="#17B26A" offset={[-4, 34]} style={{ width: 10, height: 10 }}>
                        <Avatar size={40} src={user.avatarUrl} icon={!user.avatarUrl && <UserOutlined />} className="menu-avatar" style={{ cursor: 'pointer' }} />
                    </Badge>
                </Popover>
            </div>
        </div>
    );
}

export default Menu;