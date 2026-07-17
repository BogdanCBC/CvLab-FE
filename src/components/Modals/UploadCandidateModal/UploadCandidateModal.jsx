import React, { useState } from 'react';
import './UploadCandidateModal.scss';
import { Modal, Upload, Button, Select } from 'antd';
import UploadCandidate from '../UploadCandidate/UploadCandidate';
import { downloadFileFromBlob, getFileNameFromDisposition } from '../../../helperFunctions';
import api from '../../../api.js';
import { v4 as uuidv4 } from 'uuid';
import { fetchCandidates } from '../../../utils/fetchCandidates.js';
import { cleanupFailedCandidate } from '../../../utils/cleanupFailedCandidate.js';
import { getTenantConfig } from '../../../utils/tenantConfig';
import { useTranslation } from 'react-i18next';
import { UploadIcon } from '../../../constants/icons';

const { Dragger } = Upload;

function UploadCandidateModal(props) {
  const { t, i18n } = useTranslation();
  const [files, setFiles] = useState([]);
  const [downloadType, setDownloadType] = useState('pdf');
  const [isUploading, setIsUploading] = useState(false);
  const [submitBtnStatus, setSubmitStatusBtn] = useState(false);

  const fileLanguage = i18n.language?.startsWith('fr') ? 'French' : 'English';

  // DEFAULT TEMPLATE
  const tenantTemplates = getTenantConfig().templates;
  const [templateType, setTemplateType] = useState(tenantTemplates[0]);
  const [iseSubType, setIseSubType] = useState('');

  const hasUnresolvedDuplicates = files.some((f) => f.status === 'duplicate');

  // ─── File selection via Dragger ────────────────────────────────────────────
  const handleBeforeUpload = (file) => {
    if (file.type !== 'application/pdf') return Upload.LIST_IGNORE;
    setFiles((prev) => [
      ...prev,
      {
        id: uuidv4(),
        fileName: file.name,
        file,
        additionalInfo: '',
        progress: 0,
        status: 'pending',
      },
    ]);
    return false; // Prevent auto-upload; we manage it ourselves
  };

  const handleDescriptionChange = (fileId, additionalInfo) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, additionalInfo } : f))
    );
  };

  const handleRemoveFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleChangeTemplateType = (value) => {
    setTemplateType(value);
    if (value !== 'ISE') setIseSubType('');
  };

  const handleModalClose = async () => {
    setFiles([]);
    props.setModalState(false);
    setSubmitStatusBtn(false);
    window.dispatchEvent(new Event('refreshCandidates'));
  };

  // ─── Upload logic (unchanged) ──────────────────────────────────────────────
  const uploadSingleCV = async (fileData) => {
    const formData = new FormData();
    formData.append('cv_pdf', fileData.file);
    formData.append('additional_info', fileData.additionalInfo);
    formData.append('file_language', fileLanguage);
    try {
      const response = await api.post('/cv/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', fileData.fileName, error);
      return { error: true };
    }
  };

  // Returns 'success', 'error' or 'duplicate' depending on the outcome
  const processFile = async (file) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, progress: 50, status: 'loading' } : f))
    );

    const response = await uploadSingleCV(file);

    if (response.error) {
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, progress: 100, status: 'error' } : f))
      );
      if (response.new_candidate_id) await cleanupFailedCandidate(response.new_candidate_id);
      return 'error';
    }

    if (response.duplicates === false && response.new_candidate_id) {
      try {
        const res = await api.get('/cv/generate', {
          params: {
            candidate_id: response.new_candidate_id,
            file_type: downloadType,
            template_type: iseSubType || templateType,
          },
          responseType: 'blob',
        });
        const disposition = res.headers['content-disposition'];
        const fileName =
          getFileNameFromDisposition(disposition) || `${file.fileName}_output.${downloadType}`;
        downloadFileFromBlob(res.data, fileName);
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress: 100, status: 'success' } : f))
        );
        return 'success';
      } catch (downloadError) {
        console.error(`Download failed for ${file.fileName}`, downloadError);
        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, progress: 100, status: 'error' } : f))
        );
        if (response.new_candidate_id) await cleanupFailedCandidate(response.new_candidate_id);
        return 'error';
      }
    } else {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, progress: 100, status: 'duplicate', duplicateInfo: response }
            : f
        )
      );
      return 'duplicate';
    }
  };

  const handleSubmit = async () => {
    setSubmitStatusBtn(true);
    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;
    for (const file of files) {
      const result = await processFile(file);
      if (result === 'success') successCount++;
      else if (result === 'error') errorCount++;
    }
    setIsUploading(false);
    window.dispatchEvent(new Event('refreshCandidates'));
    if (successCount > 0) props.setSuccess(successCount);
    if (errorCount > 0) props.setError(errorCount);
  };

  const handleKeepDuplicate = async (localId) => {
    const target = files.find((f) => f.id === localId);
    if (!target) return;
    setFiles((prev) =>
      prev.map((f) => (f.id === localId ? { ...f, status: 'loading', progress: 75 } : f))
    );
    try {
      const res = await api.get('/cv/generate', {
        params: {
          candidate_id: target.duplicateInfo.new_candidate_id,
          file_type: downloadType,
          template_type: iseSubType || templateType,
        },
        responseType: 'blob',
      });
      const mime =
        downloadType === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      const blob = new Blob([res.data], { type: mime });
      downloadFileFromBlob(
        blob,
        target.fileName.replace(/\.pdf$/i, '') + `_output.${downloadType}`
      );
      setFiles((prev) =>
        prev.map((f) => (f.id === localId ? { ...f, status: 'done', progress: 100 } : f))
      );
    } catch (err) {
      console.error('Keep duplicate failed', err);
      setFiles((prev) =>
        prev.map((f) => (f.id === localId ? { ...f, status: 'error', progress: 100 } : f))
      );
      if (target.duplicateInfo?.new_candidate_id)
        await cleanupFailedCandidate(target.duplicateInfo.new_candidate_id);
    }
  };

  const handleDeleteDuplicate = async (localId) => {
    const target = files.find((f) => f.id === localId);
    if (!target) return;
    const duplicateIds = target.duplicateInfo?.duplicate_candidates_ids;
    const serverCandidateId = target.duplicateInfo?.new_candidate_id;
    setFiles((prev) =>
      prev.map((f) => (f.id === localId ? { ...f, status: 'loading', progress: 25 } : f))
    );
    try {
      if (duplicateIds?.length)
        await api.delete('/candidates/soft-delete', { data: duplicateIds });
      setFiles((prev) =>
        prev.map((f) => (f.id === localId ? { ...f, progress: 60 } : f))
      );
      const res = await api.get('/cv/generate', {
        params: {
          candidate_id: serverCandidateId,
          file_type: downloadType,
          template_type: iseSubType || templateType,
        },
        responseType: 'blob',
      });
      const mime =
        downloadType === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      const blob = new Blob([res.data], { type: mime });
      downloadFileFromBlob(
        blob,
        target.fileName.replace(/\.pdf$/i, '') + `_output.${downloadType}`
      );
      setFiles((prev) =>
        prev.map((f) => (f.id === localId ? { ...f, status: 'done', progress: 100 } : f))
      );
      fetchCandidates(i18n.language).then((data) => props.setCandidates(data));
    } catch (err) {
      console.error('Delete duplicates + keep new failed', err);
      setFiles((prev) =>
        prev.map((f) => (f.id === localId ? { ...f, status: 'error', progress: 100 } : f))
      );
      if (target.duplicateInfo?.new_candidate_id)
        await cleanupFailedCandidate(target.duplicateInfo.new_candidate_id);
    }
  };

  const isSubmitDisabled =
    submitBtnStatus ||
    files.length === 0 ||
    (templateType === 'ISE' && !iseSubType);

  // ─── Render ────────────────────────────────────────────────────────────────
  const modalTitle = (
    <div className="ucm-title-block">
      <span className="ucm-title">{t('uploadCandidateModal.title')}</span>
      <span className="ucm-subtitle">{t('uploadCandidateModal.subtitle')}</span>
    </div>
  );

  const modalFooter = (
    <div className="ucm-footer">
      <Button
        className="default-grey-button"
        onClick={handleModalClose}
        disabled={isUploading || hasUnresolvedDuplicates}
      >
        {t('uploadCandidateModal.cancel' || 'Cancel')}
      </Button>
      <Button
        type="primary"
        className="default-button"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        loading={isUploading}
      >
        {t('uploadCandidateModal.uploadText') || 'Upload'}&nbsp;
        {files.length > 0 ? `${files.length} CV's` : ''}
      </Button>
    </div>
  );

  return (
    <Modal
      open={props.modalState}
      onCancel={() => {
        if (isUploading || hasUnresolvedDuplicates) return;
        handleModalClose();
      }}
      title={modalTitle}
      footer={modalFooter}
      width={900}
      closable={!isUploading && !hasUnresolvedDuplicates}
      mask={{ closable: !isUploading && !hasUnresolvedDuplicates }}
      destroyOnHidden
    >
      <div className="ucm-body">
        {/* Drop zone */}
        <Dragger
          multiple
          accept=".pdf"
          beforeUpload={handleBeforeUpload}
          showUploadList={false}
          disabled={submitBtnStatus}
        >
          <p className="ant-upload-drag-icon">
            <UploadIcon />
          </p>
          <p className="ant-upload-text">
            <span style={{ color: '#0577BA' }}>
              {t('uploadCandidateModal.upload_click') || 'Click to upload'}
            </span>{' '}
            {t('uploadCandidateModal.dragDrop') || 'or drag and drop'}
          </p>
          <p className="ant-upload-hint">{t('uploadCandidateModal.pdfOnly') || 'PDF files only'}</p>
        </Dragger>

        {/* Selectors + file list (only when files are present) */}
        {files.length > 0 && (
          <>
            <div className="ucm-selectors">
              <Select
                value={downloadType}
                onChange={setDownloadType}
                disabled={submitBtnStatus}
                style={{ flex: 1 }}
                placeholder={t('uploadCandidateModal.downloadFileType')}
                options={[
                  { value: 'pdf',  label: 'PDF'  },
                  { value: 'pptx', label: 'PPTX' },
                  { value: 'docx', label: 'DOCX' },
                ]}
              />
              <Select
                value={templateType}
                onChange={handleChangeTemplateType}
                disabled={submitBtnStatus}
                style={{ flex: 1 }}
                placeholder={t('uploadCandidateModal.template')}
                options={getTenantConfig().templates.map((tmpl) => ({
                  value: tmpl,
                  label: tmpl,
                }))}
              />
              {templateType === 'ISE' && (
                <Select
                  value={iseSubType || undefined}
                  onChange={setIseSubType}
                  disabled={submitBtnStatus}
                  style={{ flex: 1 }}
                  placeholder={`ISE ${t('uploadCandidateModal.template') || 'Template'}`}
                  options={[
                    { value: 'ISE1', label: `${t('uploadCandidateModal.template') || 'Template'} 1` },
                    { value: 'ISE2', label: `${t('uploadCandidateModal.template') || 'Template'} 2` },
                    { value: 'ISE3', label: `${t('uploadCandidateModal.template') || 'Template'} 3` },
                  ]}
                />
              )}
            </div>

            <div className="ucm-file-list">
              {files.map((file) => (
                <UploadCandidate
                  key={file.id}
                  fileData={file}
                  onDescriptionChange={handleDescriptionChange}
                  onRemove={handleRemoveFile}
                  onKeepDuplicate={handleKeepDuplicate}
                  onDeleteDuplicate={handleDeleteDuplicate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default UploadCandidateModal;
