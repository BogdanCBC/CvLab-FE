import React, { useState } from 'react';
import './TopBar.css';
import { Button, Box } from '@mui/material';
import Alert from "@mui/material/Alert";
import CheckIcon from '@mui/icons-material/Check';
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