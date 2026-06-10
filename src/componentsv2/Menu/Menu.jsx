import React, {useEffect, useState} from 'react';
import './Menu.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import {getTenantConfig} from "../../utils/tenantConfig";

import { useTranslation } from 'react-i18next';
import { Form, Input, Button, Checkbox, Typography, Alert, Tooltip, Icon } from 'antd';
import LogoIcon from '../../images/Logomark-small.svg';

import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { CvIcon, CvIconActive, JobIcon, JobIconActive } from "../../constants/icons";
import { useActivePage, PAGES } from '../../store/activePageStore';


function Menu(props) {
    const {t, i18n } = useTranslation();
    const storedRole = localStorage.getItem('role');
    const { setActivePage } = useActivePage();
    const { pathname } = useLocation();

    const [open, setOpen] = useState(false);
    const [openTextModal, setOpenTextModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [warning, setWarning] = useState(false);
    const [error, setError] = useState(false);
    const [logo, setLogo] = useState(require('../../images/logov2.png'));

    const navigate = useNavigate();

    useEffect(() => {
        const config = getTenantConfig();
        setLogo(config.logo);
    }, []);

    const handleLanguageChange = (event) => {
        const newLang = event.target.value;
        i18n.changeLanguage(newLang);
    }

    function handleLogout() {
        localStorage.clear();
        props.setIsLoggedIn(false);
        navigate('/login');
    }

    const handleNavigateJob = () => {
        setActivePage(PAGES.JOB_DESCRIPTION);
        navigate('/job-description');
    }

    const handleNavigateAdmin = () => {
        setActivePage(PAGES.ADMIN);
        navigate('/admin');
    };

    const handleNavigateCv = () => {
        setActivePage(PAGES.CV);
        navigate('/candidates');
    }

    const renderTooltipContent = () => (
        <>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.2, textAlign: "justify" }}>
                {t("topbar.tooltip_title")}
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', textAlign: "justify" }}>
                <li>{t("topbar.accessTooltip")}</li>
                <li>{t("topbar.navigateTooltip")}</li>
                <li>{t("topbar.logoutTooltip")}</li>
            </ul>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.2, mt: 1, textAlign: "justify" }}>
                {t("topbar.leftSideTooltip")}
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', textAlign: "justify" }}>
                <li>{t("topbar.tableTooltip")}</li>
                <li>{t("topbar.searchTooltip")}</li>
                <li>{t("topbar.fetchTooltip")}</li>
                <li>{t("topbar.selectTooltip")}</li>
            </ul>
        </>
    )

    return (
        <div className="menu">
            <div className="top">
                <div class="logo-wrapper">
                    <img src={LogoIcon} alt='logo' style={{ maxHeight: '80px' }} />
                </div>
                <Tooltip title={t('topbar.candidate_cv')}>
                    <Button className={`icon-button ${pathname === "/candidates" ? "active" : ""}`} type="primary" icon={pathname === "/candidates" ? <CvIconActive /> : <CvIcon />} onClick={handleNavigateCv}/>
                </Tooltip>
                <Tooltip title={t('topbar.job_desc')}>
                    <Button className={`icon-button ${pathname === "/job-description" ? "active" : ""}`} type="primary" icon={pathname === "/job-description" ? <JobIconActive /> : <JobIcon />} onClick={handleNavigateJob}/>
                </Tooltip>
                <Tooltip title={t('topbar.admin')}>
                    <Button className={`icon-button ${pathname === "/admin" ? "active" : ""}`} type="primary" icon={pathname === "/admin" ? <UserOutlined style={{color : '#717680'}}/> : <UserOutlined style={{color : '#A4A7AE'}}/>} onClick={handleNavigateAdmin}/>
                </Tooltip>
            </div>
            <div className="bottom">
                <Tooltip title={t('topbar.logoutTooltip')}>
                    <Button className='icon-button' type="primary" icon={<LogoutOutlined style={{color : '#A4A7AE'}} />} onClick={handleLogout} />
                </Tooltip>
            </div>
        </div>





        // <div className="top-bar">
        //     {success && (
        //         <div className="alert-wrapper">
        //             <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        //                 {t("topbar.successAlert")}
        //             </Alert>
        //         </div>
        //     )}
            
        //     {warning && (
        //         <div className="alert-wrapper">
        //             <Alert severity="warning">
        //                 {t("topbar.warningAlert")}
        //             </Alert>
        //         </div>
        //     )}
    
        //     {error && (
        //         <div className="alert-wrapper">
        //             <Alert severity="error">
        //                 {t("topbar.errorAlert")}
        //             </Alert>
        //         </div>
        //     )}

        //     <div className="controls-row">
        //         <img src={logo} alt='logo' style={{ maxHeight: '150px', marginTop: '5rem' }} />
 
        //         <div className="button-wrapper">
        //             <FormControl size="small" sx={{ minWidth: 130 }}>
        //                 <Select
        //                     value={i18n.language?.startsWith('fr') ? 'fr' : 'en'}
        //                     onChange={handleLanguageChange}
        //                     displayEmpty
        //                     startAdornment={<LanguageIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'gray' }} />}
        //                     sx={{ height: '40px', borderRadius: '8px'}}
        //                 >
        //                     <MenuItem value="en">UK</MenuItem>
        //                     <MenuItem value="fr">France</MenuItem>
        //                 </Select>
        //             </FormControl>

        //             <Tooltip title={renderTooltipContent()} sx={{mr: 2, ml: 2}}>
        //                 <IconButton>
        //                     <InfoOutlineIcon/>
        //                 </IconButton>
        //             </Tooltip>

        //             <Button
        //                 onClick={() => setOpen(true)}
        //                 variant="contained"
        //                 sx={{ mr: 1 }}
        //             >
        //                 {t('topbar.upload', 'Upload PDF')}
        //             </Button>

        //             <Button
        //                 onClick={() => setOpenTextModal(true)}
        //                 variant="contained"
        //             >
        //                 {t('topbar.pasteText', 'Paste Text')}
        //             </Button>
        //         </div>
        //     </div>

        //     <Box
        //         display="flex"
        //         justifyContent="flex-end"
        //         sx={{marginTop: "25px", marginRight: "40px"}}
        //     >
        //         <Button
        //             variant="outlined"
        //             onClick={handleNavigateJob}
        //             sx={{marginRight: "10px"}}
        //         >
        //             {t('topbar.job_desc')}
        //         </Button>

        //         {(storedRole === 'admin' || storedRole === 'superadmin') && (
        //             <Button
        //                 variant="outlined"
        //                 onClick={handleNavigateAdmin}
        //                 sx={{marginRight: "10px"}}
        //             >
        //                 {t('topbar.admin')}
        //             </Button>
        //         )}

        //         <Button
        //             variant='outlined'
        //             className="logout-button"
        //             onClick={handleLogout}
        //         >
        //             {t('topbar.logout')}
        //         </Button>
        //     </Box>
        //     <div className="logout-button-wrapper">

        //     </div>
            
        //     <UploadCandidateModal
        //         modalState={open}
        //         setModalState={setOpen}
        //         setSuccess={setSuccess}
        //         setWarning={setWarning}
        //         setError={setError}
        //         candidates={props.candidates}
        //         setCandidates={props.setCandidates}
        //     />

        //     <UploadTextModal
        //         modalState={openTextModal}
        //         setModalState={setOpenTextModal}
        //         setSuccess={setSuccess}
        //         setWarning={setWarning}
        //         setError={setError}
        //         candidates={props.candidates}
        //         setCandidates={props.setCandidates}
        //     />
        // </div>
    );
}

export default Menu;