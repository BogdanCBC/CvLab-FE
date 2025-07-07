import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import './DuplicateModal.css';

// 🔽 NEW imports
import api from '../../../api.js';
import {
  downloadFileFromBlob,
  getFileNameFromDisposition,
} from '../../../helperFunctions';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function DuplicateModal({
  openDuplicate,
  setOpenDuplicate,
  duplicateData,
  downloadType = 'pdf',
  onResolved
}) {
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => setOpenDuplicate(false);

  /** Generic downloader used by both buttons */
  const runHandleDuplicates = async (replaceFlag) => {
    if (!duplicateData) return console.warn('duplicateData missing');

    const newCandidateId = duplicateData.new_candidate_id;
    const duplicateIds = duplicateData.existing_candidates_ids || []

    const params = new URLSearchParams();
    params.append('replace', replaceFlag);
    params.append('file_type', downloadType);
    params.append('new_candidate_id', newCandidateId);
    duplicateIds.forEach((id) => params.append('duplicate_ids', id));

    try {
      setLoading(true);

      const res = await api.get(`/handle-duplicates?${params.toString()}`, {
        responseType: 'blob',
        headers: { Accept: '/' }, // server decides pdf vs pptx
      });

      const disposition = res.headers['content-disposition'];
      const filename =
        getFileNameFromDisposition(disposition) ||
        `candidate.${downloadType}`;

      downloadFileFromBlob(new Blob([res.data]), filename);
    } catch (err) {
      console.error('Download failed:', err);

    } finally {
      setLoading(false);
      onResolved?.();
      handleClose();
    }
  };

  const handleReplace = () => runHandleDuplicates(true);
  const handleKeepAll = () => runHandleDuplicates(false);

  return (
    <Modal
      open={openDuplicate}
      onClose={handleClose}
      aria-labelledby="duplicate-modal-title"
      aria-describedby="duplicate-modal-description"
    >
      <Box sx={style}>
        <div className="duplicate-modal-header">
          <h2 id="duplicate-modal-title">Duplicate candidate detected!</h2>
          <p id="duplicate-modal-description">
            {(duplicateData?.duplicates?.length ?? 0)} similar candidate(s)
            found. What would you like to do?
          </p>
        </div>

        <div className="handle-duplicate">
          <Button
            variant="outlined"
            onClick={handleKeepAll}
            disabled={loading}
          >
            {loading ? 'Processing…' : 'Keep All'}
          </Button>
          <Button
            variant="contained"
            onClick={handleReplace}
            sx={{ ml: 2 }}
            disabled={loading}
          >
            {loading ? 'Processing…' : 'Replace'}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default DuplicateModal;