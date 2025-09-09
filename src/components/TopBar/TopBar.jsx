import React, { useState } from 'react';
import './TopBar.css';
import { Button, Box, Tooltip, IconButton, Typography } from '@mui/material';
import Alert from "@mui/material/Alert";
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { useNavigate } from 'react-router-dom';
import UploadCandidateModal from './UploadCandidateModal/UploadCandidateModal';

function TopBar(props) {
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [warning, setWarning] = useState(false);
    const [error, setError] = useState(false);
    const navigateLogin = useNavigate();

    function handleLogout() {
        localStorage.clear();
        props.setIsLoggedIn(false);
        navigateLogin('/login'); 
    }

    const handleNavigateJob = () => {
        navigateLogin('/job-description')
    }


    const renderTooltipContent = () => (
        <>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.2, textAlign: "justify" }}>
                Top Bar:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', textAlign: "justify" }}>
                <li>Access the "Upload Candidate": in order to upload new CVs</li>
                <li>Navigate to Job Description Page</li>
                <li>Log out</li>
            </ul>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.2, mt: 1, textAlign: "justify" }}>
                Left Side:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', textAlign: "justify" }}>
                <li>The table will display uploaded candidates</li>
                <li>Search for the desired candidate using the searchbar or filter them using "Advanced Filters"</li>
                <li>Fetch back all the candidates by clicking the "Refresh button"</li>
                <li>Select a candidate from the table and it will be displayed on the right side</li>
            </ul>
        </>
    )

    return (
        <div className="top-bar">
            {success && (
                <div className="alert-wrapper">
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        File(s) processed successfully!
                    </Alert>
                </div>
            )}
            
            {warning && (
                <div className="alert-wrapper">
                    <Alert severity="warning">
                        Warning message here!
                    </Alert>
                </div>
            )}
    
            {error && (
                <div className="alert-wrapper">
                    <Alert severity="error">
                        Error occurred!
                    </Alert>
                </div>
            )}

            <div className="controls-row">
                <img src={ require('../../images/logov2.png') } />
 
                <div className="button-wrapper">
                    <Tooltip title={renderTooltipContent()} sx={{mr: 2}}>
                        <IconButton>
                            <InfoOutlineIcon/>
                        </IconButton>
                    </Tooltip>
                    <Button
                        onClick={() => setOpen(true)}
                        variant="contained"
                    >
                        Upload Candidate
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
                    Job Description
                </Button>

                <Button
                    variant='outlined'
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
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