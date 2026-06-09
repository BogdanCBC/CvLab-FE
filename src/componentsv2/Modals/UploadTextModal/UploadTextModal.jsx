import React, { useState } from 'react';
import './UploadTextModal.scss';
import { Modal, Button, Select, Input } from 'antd';
import { downloadFileFromBlob, getFileNameFromDisposition } from '../../../helperFunctions';
import api from '../../../api.js';
import { getTenantConfig } from '../../../utils/tenantConfig';
import { useTranslation } from 'react-i18next';
import { fetchCandidates } from '../../../utils/fetchCandidates.js';

const { TextArea } = Input;

export default function UploadTextModal(props) {
  const { t, i18n } = useTranslation();
  const [rawText, setRawText] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [downloadType, setDownloadType] = useState('pdf');
  const [isUploading, setIsUploading] = useState(false);

  const fileLanguage = i18n.language?.startsWith('fr') ? 'French' : 'English';

  const tenantTemplates = getTenantConfig().templates;
  const [templateType, setTemplateType] = useState(tenantTemplates[0]);
  const [iseSubType, setIseSubType] = useState('');

  const handleModalClose = () => {
    setRawText('');
    setAdditionalInfo('');
    props.setModalState(false);
  };

  const handleChangeTemplateType = (value) => {
    setTemplateType(value);
    if (value !== 'ISE') setIseSubType('');
  };

  const handleSubmit = async () => {
    if (!rawText.trim()) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('raw_text', rawText);
    formData.append('additional_info', additionalInfo);
    formData.append('file_language', fileLanguage);

    try {
      const response = await api.post('/cv/from-text', formData, {
        headers: {
          ContentType: 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      const { new_candidate_id } = response.data;

      if (new_candidate_id) {
        const res = await api.get('/cv/generate', {
          params: {
            candidate_id: new_candidate_id,
            file_type: downloadType,
            template_type: iseSubType || templateType,
          },
          responseType: 'blob',
        });

        const disposition = res.headers['content-disposition'];
        const fileName =
          getFileNameFromDisposition(disposition) ||
          `Candidate_${new_candidate_id}_output.${downloadType}`;
        downloadFileFromBlob(res.data, fileName);
      }

      handleModalClose();
      window.dispatchEvent(new Event('refreshCandidates'));

      if (props.setCandidates) {
        fetchCandidates(i18n.language).then((data) => props.setCandidates(data));
      }
    } catch (error) {
      console.error('Error processing raw text:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitDisabled = isUploading || !rawText.trim() || (templateType === 'ISE' && !iseSubType);

  const modalTitle = (
    <div className="utm-title-block">
      <span className="utm-title">{t('uploadTextModal.title', 'Paste Candidate Profile')}</span>
      <span className="utm-subtitle">
        {t('uploadTextModal.subtitle', 'Paste raw resume or LinkedIn text to generate a formatted CV')}
      </span>
    </div>
  );

  const modalFooter = (
    <div className="utm-footer">
      <Button
        className="default-grey-button"
        onClick={handleModalClose}
        disabled={isUploading}
      >
        {t('uploadCandidateModal.cancel', 'Cancel')}
      </Button>
      <Button
        type="primary"
        className="default-button"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
        loading={isUploading}
      >
        {isUploading
          ? t('uploadTextModal.processing', 'Processing...')
          : t('uploadCandidateModal.submit', 'Submit')}
      </Button>
    </div>
  );

  return (
    <Modal
      open={props.modalState}
      onCancel={() => {
        if (isUploading) return;
        handleModalClose();
      }}
      title={modalTitle}
      footer={modalFooter}
      width={700}
      closable={!isUploading}
      maskClosable={!isUploading}
      destroyOnClose
    >
      <div className="utm-body">
        <TextArea
          rows={8}
          placeholder={t('uploadTextModal.rawTextLabel', 'Paste Raw Resume / LinkedIn Text Here')}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          disabled={isUploading}
        />

        <Input
          placeholder={t('uploadTextModal.additionalInfo', 'Additional HR Notes (Optional)')}
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          disabled={isUploading}
        />

        <div className="utm-selectors">
          <Select
            value={downloadType}
            onChange={setDownloadType}
            disabled={isUploading}
            style={{ flex: 1 }}
            placeholder={t('uploadCandidateModal.downloadFileType')}
            options={[
              { value: 'pdf', label: 'PDF' },
              { value: 'pptx', label: 'PPTX' },
              { value: 'docx', label: 'DOCX' },
            ]}
          />
          <Select
            value={templateType}
            onChange={handleChangeTemplateType}
            disabled={isUploading}
            style={{ flex: 1 }}
            placeholder={t('uploadCandidateModal.template')}
            options={tenantTemplates.map((tmpl) => ({ value: tmpl, label: tmpl }))}
          />
          {templateType === 'ISE' && (
            <Select
              value={iseSubType || undefined}
              onChange={setIseSubType}
              disabled={isUploading}
              style={{ flex: 1 }}
              placeholder={`ISE ${t('uploadCandidateModal.template', 'Template')}`}
              options={[
                { value: 'ISE1', label: `${t('uploadCandidateModal.template', 'Template')} 1` },
                { value: 'ISE2', label: `${t('uploadCandidateModal.template', 'Template')} 2` },
                { value: 'ISE3', label: `${t('uploadCandidateModal.template', 'Template')} 3` },
              ]}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
