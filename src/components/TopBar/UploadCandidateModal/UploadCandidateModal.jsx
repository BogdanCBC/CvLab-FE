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
import { cleanupFailedCandidate } from '../../../utils/cleanupFailedCandidate.js';
import {getTenantConfig} from "../../../utils/tenantConfig";
import {useTranslation} from "react-i18next";

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
  const { t, i18n} = useTranslation();
  const [files, setFiles] = useState([]);
  const [downloadType, setDownloadType] = useState('pdf');
  const [isUploading, setIsUploading] = useState(false);
  const [submitBtnStatus, setSubmitStatusBtn] = useState(false);

  const fileLanguage = i18n.language?.startsWith('fr') ? 'French' : 'English';

  // DEFAULT TEMPLATE
  const tenantTemplates = getTenantConfig().templates;
  const [templateType, setTemplateType] = useState(tenantTemplates[0]);

  const [iseSubType, setIseSubType] = useState('');

  const hasUnresolvedDuplicates = files.some(f => f.status === "duplicate");

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

  const handleChangeTemplateType = (event) => {
    const value = event.target.value;
    setTemplateType(value);
    if (value !== "ISE") {
      setIseSubType("");
    }
  }

  const handleChangeIseSubType = (event) => {
    setIseSubType(event.target.value);
  };

  const handleModalClose = async () => {
    setFiles([]);
    props.setModalState(false);
    setSubmitStatusBtn(false);
    fetchCandidates(i18n.language).then(sortedCandidates => {
      props.setCandidates(sortedCandidates);
    });
  }

  const uploadSingleCV = async (fileData) => {
    const formData = new FormData();
    formData.append('cv_pdf', fileData.file);
    formData.append('additional_info', fileData.additionalInfo);
    formData.append('file_language', fileLanguage);

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
    setFiles(prev =>
      prev.map(f =>
        f.id === file.id ? { ...f, progress: 50, status: 'loading' } : f
      )
    );

    const response = await uploadSingleCV(file);
    
    // console.log(response)
    if (response.error) {
      setFiles(prev =>
        prev.map(f =>
          f.id === file.id ? { ...f, progress: 100, status: 'error' } : f
        )
      );

      if (response.new_candidate_id) {
        await cleanupFailedCandidate(response.new_candidate_id);
      }
      return;
    }

    if (response.duplicates === false && response.new_candidate_id) {
      try {
        const res = await api.get('/cv/generate', {
          params: {
            candidate_id: response.new_candidate_id,
            file_type: downloadType,
            template_type: iseSubType || templateType
          },
          responseType: 'blob',
        });

        const disposition = res.headers['content-disposition'];
        const fileName = getFileNameFromDisposition(disposition) || `${file.fileName}_output.${downloadType}`;

        downloadFileFromBlob(res.data, fileName);

        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, progress: 100, status: 'success' } : f
          )
        );
      } catch (downloadError) {
        console.error(`Download failed for ${file.fileName}`, downloadError);
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, progress: 100, status: 'error' } : f
          )
        );
        if (response.new_candidate_id) {
          await cleanupFailedCandidate(response.new_candidate_id);
        }
        return;
      }
    } else {
      setFiles(prev =>
        prev.map(f =>
          f.id === file.id 
            ? { 
                ...f,
                progress: 100,
                status: 'duplicate',
                duplicateInfo: response } : f
        )
      );
    }
  };

  const handleSubmit = async () => {
      setSubmitStatusBtn(true);
      setIsUploading(true);
      for (const file of files) {
        await processFile(file);
      }
      setIsUploading(false);
      await fetchCandidates(i18n.language).then(data => props.setCandidates(data));
  }

  const handleKeepDuplicate = async (localId) => {
    const target = files.find((f) => f.id === localId);
    if (!target) return;

    setFiles((prev) => 
      prev.map((f) => (f.id === localId ? {...f, status: 'loading', progress: 75} : f))
    );

    // console.log(target)
    // console.log(target.duplicateInfo?.new_candidate_id)

    try {
      const serverCandidateId = target.duplicateInfo.new_candidate_id;
      const fileName = target.fileName;
      
      const res = await api.get('/cv/generate', {
        params: {
          candidate_id: serverCandidateId,
          file_type: downloadType,
          template_type: iseSubType || templateType
        },
        responseType: 'blob',
      });
      
      const mime =
        downloadType === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      const blob = new Blob([res.data], { type: mime });
      const safeName = fileName.replace(/\.pdf$/i, '') + `_output.${downloadType}`;
      downloadFileFromBlob(blob, safeName);

      // success UI
      setFiles((prev) =>
        prev.map((f) => (f.id === localId ? { ...f, status: 'done', progress: 100 } : f))
      );

    } catch (err) {
        console.error('Keep duplicate failed', err);
        setFiles((prev) =>
          prev.map((f) => (f.id === localId ? { ...f, status: 'error', progress: 100 } : f))
        );

        if (target.duplicateInfo?.new_candidate_id) {
          await cleanupFailedCandidate(target.duplicateInfo.new_candidate_id);
        }
      }
  }

  const handleDeleteDuplicate = async (localId) => {
    const target = files.find((f) => f.id === localId);
    if (!target) return;

    const duplicateIds = target.duplicateInfo?.duplicate_candidates_ids;
    const serverCandidateId = target.duplicateInfo?.new_candidate_id;
    const fileName = target.fileName;

    setFiles((prev) => 
      prev.map((f) => (f.id === localId ? {...f, status: 'loading', progress: 25} : f))
    );

    try {
      if (duplicateIds.length){
        await api.delete('/candidates/soft-delete', { data: duplicateIds });
      }

      setFiles((prev) => 
        prev.map((f) => (f.id === localId ? {...f, progress: 60} : f))
      );

      const res = await api.get('/cv/generate', {
        params: {
          candidate_id: serverCandidateId,
          file_type: downloadType, 
          template_type: iseSubType || templateType
        },
        responseType: 'blob',
      });

      const mime = 
        downloadType === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      
        const blob = new Blob([res.data], {type: mime});
        const safeName = fileName.replace(/\.pdf$/i,'') + `_output.${downloadType}`;
        downloadFileFromBlob(blob, safeName);

        setFiles((prev) => 
          prev.map((f) => 
            f.id === localId ? {...f, status: 'done', progress: 100} : f
          )
        );

        fetchCandidates(i18n.language).then(data => props.setCandidates(data));
    } catch (err) {
      console.error('Delete duplicates + keep new failed', err);
      setFiles((prev) => 
        prev.map((f) => (f.id === localId ? {...f, status: 'error', progress: 100} : f))
      );

      if (target.duplicateInfo?.new_candidate_id) {
        await cleanupFailedCandidate(target.duplicateInfo.new_candidate_id);
      }
    }
  };

  const isSubmitDisabled = submitBtnStatus || (templateType === "ISE" && !iseSubType);
  const hasFourth = templateType === 'ISE';

  return (
      <Modal
        open={props.modalState}
        onClose={(event, reason) => {
          if ((isUploading || hasUnresolvedDuplicates) && (reason === "backdropClick" || reason === "escapeKeyDown")) {
            return;
          }
          handleModalClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
            className="modal-box"
            component="form"
        >
            <div className="modal-header">
                <h2 id="modal-modal-title">{t('uploadCandidateModal.chooseFile')}</h2>
                <Button
                  component="label"
                  variant="contained"
                  disabled={submitBtnStatus}
                  tabIndex={-1}
                  style={{ marginBottom: '20px' }}
                >
                    {t('uploadCandidateModal.uploadBtn')}
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
                  <h3>{t('uploadCandidateModal.uploadedFiles')} ({files.length})</h3>
                  <Box 
                    sx={{ 
                      display: 'grid',
                      gap: 2 ,
                      gridTemplateColumns: { 
                          xs: '1fr',
                          sm: hasFourth ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'
                      },    
                    }}
                  >
                    <FormControl variant='outlined' fullWidth>
                      <InputLabel id="file-type-label">{t('uploadCandidateModal.downloadFileType')}</InputLabel>
                      <Select 
                        labelId='file-type-label'
                        id="file-type-select"
                        value={downloadType}
                        onChange={handleChangeFileType}
                        label="Download File Type"
                        disabled={submitBtnStatus}
                      >
                        <MenuItem value="pdf">PDF</MenuItem>
                        <MenuItem value="pptx">PPTX</MenuItem>
                        <MenuItem value="docx">DOCX</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="template-type-label">{t('uploadCandidateModal.template')}</InputLabel>
                      <Select
                        labelId="template-type-label"
                        id="template-type-select"
                        value={templateType}
                        onChange={handleChangeTemplateType}
                        label="Template"
                        disabled={submitBtnStatus}
                      >
                          {getTenantConfig().templates.map(t => (
                              <MenuItem key={t.toLowerCase()} value={t}>{t}</MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    {templateType === "ISE" && (
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="ise-subtype-label">ISE {t('uploadCandidateModal.template')}</InputLabel>
                        <Select
                          labelId="ise-subtype-label"
                          id="ise-subtype-select"
                          value={iseSubType}
                          onChange={handleChangeIseSubType}
                          label="ISE Template"
                          disabled={submitBtnStatus}
                        >
                          <MenuItem value="ISE1">{t('uploadCandidateModal.template')} 1</MenuItem>
                          <MenuItem value="ISE2">{t('uploadCandidateModal.template')} 2</MenuItem>
                          <MenuItem value="ISE3">{t('uploadCandidateModal.template')} 3</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </div>
              </div>
            )}

            {files.map(file => (
              <UploadCandidate
                key={file.id}
                fileData={file}
                onDescriptionChange={handleDescriptionChange}
                onRemove={handleRemoveFile}
                onKeepDuplicate={handleKeepDuplicate}
                onDeleteDuplicate={handleDeleteDuplicate}
              />
            ))}

            {files.length > 0 && (
              <div className="modal-actions">
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isUploading || hasUnresolvedDuplicates}
                  onClick={handleModalClose}
                >
                    {t('uploadCandidateModal.closeBtn')}
                </Button>
                <Button
                  variant="contained"
                  disabled={isSubmitDisabled}
                  onClick={handleSubmit}
                >
                    {t('uploadCandidateModal.submit')} ({files.length}) {t('uploadCandidateModal.file')}(s)
                </Button>

              </div>
            )}
          </div>
            
        </Box>
      </Modal>
  );
}

export default UploadCandidateModal;