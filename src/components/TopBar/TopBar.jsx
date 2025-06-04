import React, { useState } from 'react';
import './TopBar.css';
import Button from '@mui/material/Button';
import UploadCandidateModal from './UploadCandidateModal/UploadCandidateModal';

function TopBar() {
    const [open, setOpen] = useState(false);

    return (
        <div className="top-bar">
            <div className="button-wrapper">
                <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                >
                    Upload Candidate
                </Button>
            </div>
            <UploadCandidateModal modalState={open} setModalState={setOpen} />
        </div>
    );
}

export default TopBar;