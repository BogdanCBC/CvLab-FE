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
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [downloadType, setDownloadType] = useState('pdf');

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    const fileObject = pdfFiles.map((file) => ({
      id: uuidv4(),
      fileName: file.name,
      file: file,
      description: ''
    }))

    setFiles(prevFiles => [...prevFiles, ...fileObject])
  }

  const handleFileDescriptionChange = (fileId, description) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === fileId ? { ...file, description } : file
      )
    );
  };

  const handleChangeFileType = (event) => {
    setDownloadType(event.target.value);  
  }

  const handleRemoveFile = (fileId) => {
    console.log(files)
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  const uploadSingleFile = async (fileObj) => {
    const formData = new FormData();
    formData.append("additional_info", fileObj.description || '');
    formData.append("cv_pdf", fileObj.file);

    try{
      const response = await api.post(`/template/complete?file_type=${downloadType}`, formData, {
        headers: {
          "Accept": "application/json"
        },
        responseType: 'blob'
      })

      const disposition = response.headers['content-disposition'];
      let filename = getFileNameFromDisposition(disposition);
      const blobFile = new Blob([response.data]);

      downloadFileFromBlob(blobFile, filename);

      return {success: true, fileName: fileObj.fileName };
    } catch(error) {
      console.error(`Error uploading file ${fileObj.fileName}:`, error);
      return {success: false, fileName: fileObj.fileName, error: error.message}
    }
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please select at least one PDF file to upload.");
      return;
    }

    setLoading(true);
    const results = [];

    try{
      for (let i=0; i<files.length; i++){
        const fileObj = files[i];

        setUploadProgress(prev => ({
          ...prev,
          [fileObj.id]: {status: 'uploading', progress: 0 }
        }));

        const result = await uploadSingleFile(fileObj);
        results.push(result);

        setUploadProgress(prev => ({
          ...prev,
          [fileObj.id]: {
            status: result.success ? 'completed' : 'error',
            progress: 100,
            error: result.error 
          }
        }));
      }

      const failed = results.filter(r => !r.success).length;

      if (failed === 0){
        props.setSuccess(true);

        setTimeout(() => {
          props.setSuccess(false);
        }, 3000);

        setFiles([]);
      } else {
        props.setWarning(true);
        setTimeout(() => {
          props.setWarning(false);
        }, 3000);

        setFiles([]);
      }
      
      fetchCandidates().then(sortedCandidates => {
        props.setCandidates(sortedCandidates);
        setLoading(false);
        props.setModalState(false);
      });
    } catch (error) {
      console.error("Error during batch upload:", error);
      props.setError(true);
        setTimeout(() => {
          props.setError(false);
        }, 3000);
      setLoading(false);
    }
  };

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

                  {files.map((file) => (
                    <UploadCandidate 
                      key={file.id}
                      fileId={file.id}
                      fileName={file.fileName}
                      description={file.description}
                      onDescriptionChange={handleFileDescriptionChange}
                      onRemove={handleRemoveFile}
                      uploadStatus={uploadProgress[file.id]}
                    />
                  ))}

                  {files.length === 0 && (
                    <div style={{
                      textAlign: 'center',
                      colot: '#666',
                      padding: '40px 20px',
                      fontSize: '16px'
                    }}>
                      No PDF files uploaded yet. Click "Upload PDF files" to get started.
                    </div>
                  )}
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className='modal-actions'>
                <Button
                  variant='outlied'
                  onClick={() => props.setModalState(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                
                <Button 
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : `Submit ${files.length} File(s)`}
                </Button>
              </div>
            )}
        </Box>
      </Modal>
  );
}

export default UploadCandidateModal;