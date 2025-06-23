import React, { useState } from 'react';
import './TopBar.css';
import Button from '@mui/material/Button';
import Alert from "@mui/material/Alert";
import CheckIcon from '@mui/icons-material/Check';
import UploadCandidateModal from './UploadCandidateModal/UploadCandidateModal';

function TopBar() {
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [warning, setWarning] = useState(false);
    const [error, setError] = useState(false);

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
            
            <UploadCandidateModal
                modalState={open}
                setModalState={setOpen}
                setSuccess={setSuccess}
                setWarning={setWarning}
                setError={setError}
            />
        </div>
    );
}

export default TopBar;