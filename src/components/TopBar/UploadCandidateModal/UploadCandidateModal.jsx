import React, { useState } from 'react';
import './UploadCandidateModal.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import UploadCandidate from '../UploadCandidate/UploadCandidate';
import { Button, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import { downloadFileFromBlob, getFileNameFromDisposition } from '../../../helperFunctions';
import api from "../../../api.js"
import { v4 as uuidv4 } from 'uuid';
import { fetchCandidates } from '../../../utils/fetchCandidates.js';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function UploadCandidateModal(props) {
  const [files, setFiles] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [downloadType, setDownloadType] = useState('pdf');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');

    const fileObject = pdfFiles.map((file) => ({
      id: uuidv4(),
      fileName: file.name,
      file: file,
      additionalInfo: '',
      progress: 0,
      status: 'pending',
    }))

    setFiles(prev => [...prev, ...fileObject]);
  }

  const handleDescriptionChange = (fileId, additionalInfo) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId ? { ...file, additionalInfo } : file
      )
    );
  };

  const handleRemoveFile = (fileId) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  }

  const handleChangeFileType = (event) => {
    setDownloadType(event.target.value);  
  }

  const uploadSingleCV = async (fileData) => {
    const formData = new FormData();
    formData.append('cv_pdf', fileData.file);
    formData.append('additional_info', fileData.additionalInfo);

    try {
      const response = await api.post('/cv/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', fileData.fileName, error);
      return {error: true}
    }
  }

  const processFile = async (file) => {
    // Set to loading
    setFiles(prev =>
      prev.map(f =>
        f.id === file.id ? { ...f, progress: 50, status: 'loading' } : f
      )
    );

    const response = await uploadSingleCV(file);
    console.log(response)
    if (response.error) {
      setFiles(prev =>
        prev.map(f =>
          f.id === file.id ? { ...f, progress: 100, status: 'error' } : f
        )
      );
      return;
    }

    if (response.duplicates === false && response.new_candidate_id) {
      try {
        const res = await api.get(`/cv/generate`, {
          params: {
            candidate_id: response.new_candidate_id,
            file_type: downloadType,
          },
          responseType: 'blob',
        });

        const disposition = res.headers['content-disposition'];
        const fileName = getFileNameFromDisposition(disposition) || `${file.fileName}_output.${downloadType}`;

        downloadFileFromBlob(res.data, fileName);

        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, progress: 100, status: 'done' } : f
          )
        );
      } catch (downloadError) {
        console.error(`Download failed for ${file.fileName}`, downloadError);
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, progress: 100, status: 'error' } : f
          )
        );
      }
    } else {
      // Duplicate case — we'll handle in next step
      setFiles(prev =>
        prev.map(f =>
          f.id === file.id ? { ...f, progress: 100, status: 'duplicate', duplicateInfo: response } : f
        )
      );
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    for (const file of files) {
      await processFile(file);
    }
    setIsUploading(false);
    await fetchCandidates();
  }

  return (
      <Modal
        open={props.modalState}
        onClose={() => {props.setModalState(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
            className="modal-box"
            component="form"
        >
            <div className="modal-header">
                <h2 id="modal-modal-title">Choose PDF Files</h2>
                <Button
                  component="label"
                  variant="contained"
                  tabIndex={-1}
                  style={{ marginBottom: '20px' }}
                >
                  Upload PDF files
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    multiple
                  />
                </Button>
            </div>

          <div className='modal-content'>
            {files.length > 0 && (
              <div className='files-section'>
                <div className='files-section'>
                  <div className='files-header'>
                    <h3>Uploaded Files ({files.length})</h3>

                    <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                      <InputLabel id="file-type-label">Download File Type</InputLabel>
                      <Select
                        labelId="file-type-label"
                        id="file-type-select"
                        value={downloadType}
                        onChange={handleChangeFileType}
                        label="File Type"
                      >
                        <MenuItem value="pdf">PDF</MenuItem>
                        <MenuItem value="pptx">PPTX</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            )}

            {files.map(file => (
              <UploadCandidate
                key={file.id}
                fileData={file}
                onDescriptionChange={handleDescriptionChange}
                onRemove={handleRemoveFile}
              />
            ))}

            {files.length > 0 && (
              <div className="modal-actions">
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isUploading}
                  onClick={() => {
                    setFiles([]);
                    setDuplicates([]);
                    props.setModalState(false);
                    fetchCandidates();
                  }}
                >
                  Clear ALL
                </Button>
                <Button
                  variant="contained"
                  disabled={isUploading}
                  onClick={handleSubmit}
                >
                  Submit ({files.length}) file(s)
                </Button>

              </div>
            )}
          </div>
            
        </Box>
      </Modal>
  );
}

export default UploadCandidateModal;