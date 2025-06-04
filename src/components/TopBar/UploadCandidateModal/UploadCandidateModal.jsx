import React, { useState } from 'react';
import './UploadCandidateModal.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import UploadButton from '../UploadButton/UploadButton';

function UploadCandidateModal(props) {

  const [text, setText] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  }

  return (
      <Modal
        open={props.modalState}
        onClose={() => props.setModalState(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box
            className="modal-box"
            component="form"
        >
            <div className="modal-header">
                <h2 id="modal-modal-title">Upload Candidate</h2>
                
                <textarea
                    className="candidate-text"
                    placeholder="Add additional information about the candidate"
                    onChange={handleTextChange} />

                <UploadButton  textData={text} onClose={() => props.setModalState(false)}/>
            </div>
            
        </Box>
      </Modal>
  );
}

export default UploadCandidateModal;