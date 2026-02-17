import React, {useEffect, useState} from 'react';
import './TopBar.css';
import {Button, Box, Tooltip, IconButton, Typography, FormControl, Select, MenuItem} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import Alert from "@mui/material/Alert";
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useNavigate } from 'react-router-dom';
import UploadCandidateModal from './UploadCandidateModal/UploadCandidateModal';
import {getTenantConfig} from "../../utils/tenantConfig";

import { useTranslation } from 'react-i18next';
import { fetchCandidates } from '../../utils/fetchCandidates';

function TopBar(props) {
    const {t, i18n } = useTranslation();
    const storedRole = localStorage.getItem('role');

    const [open, setOpen] = useState(false);
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

        fetchCandidates(newLang).then(data => {
            if (props.setCandidates) {
                props.setCandidates(data);
            }
        });
    }

    function handleLogout() {
        localStorage.clear();
        props.setIsLoggedIn(false);
        navigate('/login');
    }

    const handleNavigateJob = () => {
        navigate('/job-description')
    }

    const handleNavigateAdmin = () => {
        navigate('/admin');
    };

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
        <div className="top-bar">
            {success && (
                <div className="alert-wrapper">
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        {t("topbar.successAlert")}
                    </Alert>
                </div>
            )}
            
            {warning && (
                <div className="alert-wrapper">
                    <Alert severity="warning">
                        {t("topbar.warningAlert")}
                    </Alert>
                </div>
            )}
    
            {error && (
                <div className="alert-wrapper">
                    <Alert severity="error">
                        {t("topbar.errorAlert")}
                    </Alert>
                </div>
            )}

            <div className="controls-row">
                <img src={logo} alt='logo' style={{ maxHeight: '150px', marginTop: '5rem' }} />
 
                <div className="button-wrapper">
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                            value={i18n.language?.startsWith('fr') ? 'fr' : 'en'}
                            onChange={handleLanguageChange}
                            displayEmpty
                            startAdornment={<LanguageIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'gray' }} />}
                            sx={{ height: '40px', borderRadius: '8px' }}
                        >
                            <MenuItem value="en">UK</MenuItem>
                            <MenuItem value="fr">France</MenuItem>
                        </Select>
                    </FormControl>

                    <Tooltip title={renderTooltipContent()} sx={{mr: 2}}>
                        <IconButton>
                            <InfoOutlineIcon/>
                        </IconButton>
                    </Tooltip>
                    <Button
                        onClick={() => setOpen(true)}
                        variant="contained"
                    >
                        {t('topbar.upload')}
                    </Button>
                </div>
            </div>

            <Box
                display="flex"
                justifyContent="flex-end"
                sx={{marginTop: "25px", marginRight: "40px"}}
            >
                <Button
                    variant="outlined"
                    onClick={handleNavigateJob}
                    sx={{marginRight: "10px"}}
                >
                    {t('topbar.job_desc')}
                </Button>

                {(storedRole === 'admin' || storedRole === 'superadmin') && (
                    <Button
                        variant="outlined"
                        onClick={handleNavigateAdmin}
                        sx={{marginRight: "10px"}}
                    >
                        {t('topbar.admin')}
                    </Button>
                )}

                <Button
                    variant='outlined'
                    className="logout-button"
                    onClick={handleLogout}
                >
                    {t('topbar.logout')}
                </Button>
            </Box>
            <div className="logout-button-wrapper">

            </div>
            
            <UploadCandidateModal
                modalState={open}
                setModalState={setOpen}
                setSuccess={setSuccess}
                setWarning={setWarning}
                setError={setError}
                candidates={props.candidates}
                setCandidates={props.setCandidates}
            />
        </div>
    );
}

export default TopBar;