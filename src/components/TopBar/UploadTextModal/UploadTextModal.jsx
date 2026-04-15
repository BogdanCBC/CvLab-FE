import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, InputLabel, MenuItem, FormControl, Select, TextField, Typography, CircularProgress } from '@mui/material';
import {downloadFileFromBlob, getFileNameFromDisposition, getFileNmaeFromDisposition} from "../../../helperFunctions";
import api from "../../../api.js"
import { getTenantConfig } from "../../../utils/tenantConfig";
import { useTranslation } from "react-i18next";
import { fetchCandidates } from '../../../utils/fetchCandidates.js';

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
    }

    const handleChangeTemplateType = (event) => {
        const value = event.target.value;
        setTemplateType(value);
        if (value !== "ISE") {
            setIseSubType("");
        }
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
                    'ContentType': 'multipart/form-data',
                    'Accept': 'application/json',
                }
            });
            const { new_candidate_id } = response.data;

            if (new_candidate_id) {
                const res = await api.get('/cv/generate', {
                    params: {
                        candidate_id: new_candidate_id,
                        file_type: downloadType,
                        template_type: iseSubType || templateType
                    },
                    responseType: 'blob'
                });

                const disposition = res.headers['content-disposition'];
                const fileName = getFileNameFromDisposition(disposition) || `Candidate_${new_candidate_id}_output.${downloadType}`;
                downloadFileFromBlob(res.data, fileName);
            }

            handleModalClose();
            window.dispatchEvent(new Event('refreshCandidates'));

            if (props.setCandidates) {
                fetchCandidates(i18n.language).then(data => props.setCandidates(data));
            }
        } catch (error) {
            console.error('Error processing raw text:', error);
            alert("An error occurred while creating the profile.");
        } finally {
            setIsUploading(false);
        }
    }

    const isSubmitDisabled = isUploading || !rawText.trim() || (templateType === "ISE" && !iseSubType);
    const hasFourth = templateType === 'ISE';

    return (
        <Modal
            open={props.modalState}
            onClose={(event, reason) => {
                if (isUploading && (reason === "backdropClick" || reason === "escapeKeyDown")) return;
                handleModalClose();
            }}
        >
            <Box className="modal-box" sx={{ width: '600ox', maxWidth: '90vh'}}>
                <div className="modal-header">
                    <h2>{t('uploadTextModal.title', 'Paste Candidate Profile')}</h2>
                </div>

                <div className="modal-content" style={{ marginTop: '20px'}}>
                    <TextField
                        label={t('uploadTextModal.rawTextLabel', 'Paste Raw Resume/LinkedIn Text Here')}
                        multiline
                        rows={8}
                        fullWidth
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        disabled={isUploading}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        label={t('uploadTextModal.additionalInfo', 'Additional HR Notes (Optional)')}
                        fullWidth
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        disabled={isUploading}
                        sx={{ mb: 3 }}
                    />

                    <Box
                        sx={{
                            display: 'grid',
                            gap: 2,
                            mb: 3,
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: hasFourth ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'
                            },
                        }}
                    >
                        <FormControl variant="outlined" fullWidth size="small">
                            <InputLabel id="text-file-type-label">
                                {t('uploadCandidateModal.downloadFileType')}
                            </InputLabel>
                            <Select
                                labelId="text-file-type-label"
                                value={downloadType}
                                onChange={(e) => setDownloadType(e.target.value)}
                                label="Download File Type"
                                disabled={isUploading}
                            >
                                <MenuItem value="pdf">PDF</MenuItem>
                                <MenuItem value="pptx">PPTX</MenuItem>
                                <MenuItem value="docx">DOCX</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" fullWidth size="small">
                            <InputLabel id="text-template-type-label">
                                {t('uploadCandidateModal.template')}
                            </InputLabel>
                            <Select
                                labelId="text-template-type-label"
                                value={templateType}
                                onChange={handleChangeTemplateType}
                                label="Template"
                                disabled={isUploading}
                            >
                                {tenantTemplates.map(t => (
                                    <MenuItem key={t.toLowerCase()} value={t}>{t}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {templateType === "ISE" && (
                            <FormControl variant="outlined" fullWidth size="small">
                                <InputLabel id="text-ise-subtype-label">ISE {t('uploadCandidateModal.template')}</InputLabel>
                                <Select
                                    labelId="text-ise-subtype-label"
                                    value={iseSubType}
                                    onChange={(e) => setIseSubType(e.target.value)}
                                    label="ISE Template"
                                    disabled={isUploading}
                                >
                                    <MenuItem value="ISE1">{t('uploadCandidateModal.template')} 1</MenuItem>
                                    <MenuItem value="ISE2">{t('uploadCandidateModal.template')} 2</MenuItem>
                                    <MenuItem value="ISE3">{t('uploadCandidateModal.template')} 3</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Box>

                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button
                            variant="outlined"
                            color="error"
                            disabled={isUploading}
                            onClick={handleModalClose}
                        >
                            {t('uploadCandidateModal.closeBtn')}
                        </Button>
                        <Button
                            variant="contained"
                            disabled={isSubmitDisabled}
                            onClick={handleSubmit}
                            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isUploading ? t('uploadTextModal.processing', 'Processing...') : t('uploadCandidateModal.submit')}
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}