import './Candidate.scss';
import api from "../../../api";
import React, { useState, useEffect } from "react";
import { Button, Dropdown, Select, Tooltip, message } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    CopyOutlined,
    InfoCircleOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import { getFileNameFromDisposition, downloadFileFromBlob } from "../../../helperFunctions";
import { getTenantConfig } from "../../../utils/tenantConfig";
import { useTranslation } from "react-i18next";

export default function Candidate(props) {
    const { t } = useTranslation();

    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloadFileType, setDownloadFileType] = useState('pdf');

    const BASE_URL = process.env.REACT_APP_BASE_URL + '/candidates';
    const isAdmin = ['admin', 'superadmin'].includes(localStorage.getItem('role'));

    useEffect(() => {
        fetchData();
    }, [props.candidateId]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/candidates/${props.candidateId}`);
            setCandidate({
                id: response.data.id,
                firstName: response.data.first_name || "N/A",
                description: response.data.description || "N/A",
                username: response.data.username || "N/A",
                email: response.data.email || "N/A",
                phone: response.data.phone || "N/A",
                hasOriginalCv: !!response.data.s3_key,
            });
            // message.success(t("candidate.successFetchMessage"));
        } catch (error) {
            console.error("Error fetching candidate data:", error);
        }
    };

    const getOriginalCV = async () => {
        try {
            const response = await api.get(`/candidates/cv/${props.candidateId}`, { responseType: 'blob' });
            const filename = getFileNameFromDisposition(response.headers['content-disposition']);
            downloadFileFromBlob(new Blob([response.data]), filename);
        } catch (error) {
            console.error("Error downloading CV:", error);
            message.error("An error occurred while downloading the CV.");
        }
    };

    const getFormattedCV = async (tmplType, subType = '') => {
        if (!downloadFileType) {
            message.warning('Please select a file format first');
            return;
        }
        try {
            setLoading(true);
            const finalTemplateType = tmplType === "ISE" ? subType : tmplType;
            const response = await api.get(
                `/template/${props.candidateId}?file_type=${downloadFileType}&template_type=${finalTemplateType}`,
                { responseType: 'blob' }
            );
            const disposition = response.headers['content-disposition'];
            const filename = getFileNameFromDisposition(disposition) || `CV_${props.candidateId}.${downloadFileType}`;
            downloadFileFromBlob(new Blob([response.data]), filename);
        } catch (error) {
            console.error("Error fetching formatted CV:", error);
            message.error("An error occurred while fetching the formatted CV.");
        } finally {
            setLoading(false);
        }
    };

    const deleteCandidate = async () => {
        try {
            const response = await api.delete(`/candidates?id=${props.candidateId}`);
            if (response.status === 200) {
                props.setSelectedCandidate(null);
                window.dispatchEvent(new Event('refreshCandidates'));
            }
        } catch (error) {
            console.error("Error deleting candidate:", error);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${BASE_URL}/${props.candidateId}`);
            message.success(t("candidate.clipboard"));
        } catch (err) {
            console.log(`Failed to copy! Error: ${err}`);
        }
    };

    const handleTemplateSelect = ({ key }) => {
        if (key.startsWith('ISE-')) {
            getFormattedCV('ISE', key.split('-')[1]);
        } else {
            getFormattedCV(key);
        }
    };

    const buildTemplateItems = () =>
        getTenantConfig().templates.map((tmpl) => {
            if (tmpl === 'ISE') {
                return {
                    key: 'ISE',
                    label: 'ISE',
                    children: [
                        { key: 'ISE-ISE1', label: `${t("candidate.template")} 1` },
                        { key: 'ISE-ISE2', label: `${t("candidate.template")} 2` },
                        { key: 'ISE-ISE3', label: `${t("candidate.template")} 3` },
                    ],
                };
            }
            return { key: tmpl, label: tmpl };
        });

    const tooltipContent = (
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            <li>{t("candidate.seeCandidateTooltip")}</li>
            <li>{t("candidate.getFormatedTooltip")}</li>
            <li>{t("candidate.downloadTooltip")}</li>
            <li>{t("candidate.editTooltip")}</li>
        </ul>
    );

    return (
        <div className="candidate-wrapper">
            <div className="candidate-card">

                <div className="candidate-card-header">
                    <div className="candidate-name-block">
                        <span className="candidate-label">{t("candidate.candidateName", "Candidate")}</span>
                        <h2 className="candidate-name">
                            {candidate ? candidate.firstName : t("candidate.noName")}
                        </h2>
                    </div>
                    <div className="candidate-header-actions">
                        <Tooltip title={tooltipContent}>
                            <Button icon={<InfoCircleOutlined />} className="header-icon-btn icon-button filled-icon-btn" />
                        </Tooltip>
                        <Tooltip title={t("candidate.clipboard")}>
                            <Button icon={<CopyOutlined />} className="header-icon-btn icon-button filled-icon-btn" onClick={handleCopyLink} />
                        </Tooltip>
                        {isAdmin && (
                            <Tooltip title={t("candidate.deleteBtn")}>
                                <Button  icon={<DeleteOutlined />} className="header-icon-btn icon-button filled-icon-btn" onClick={deleteCandidate} />
                            </Tooltip>
                        )}
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => props.setEditMode(true)}
                            className="edit-cv-btn filled-btn"
                        >
                            {t("candidate.editButton", "Edit CV")}
                        </Button>
                    </div>
                </div>

                <div className="candidate-card-body">
                    {isAdmin && candidate?.username && (
                        <p className="uploader-info">
                            {t("candidate.uploadedBy")} <strong>{candidate.username}</strong>
                        </p>
                    )}
                    <div className="general-info-title">{t("candidate.details", "General information")}</div>
                    <p className="candidate-description">
                        {candidate?.description}
                    </p>
                    <br/>
                    <div className="general-info-title">{t("candidate.phoneNo", "Phone Number")}</div>
                    <p className="candidate-description">
                        {candidate?.phone}
                    </p>
                    <br/>
                    <div className="general-info-title">{t("candidate.email", "Email")}</div>
                    <p className="candidate-description">
                        {candidate?.email}
                    </p>
                </div>

                <div className="candidate-card-footer">
                    <Dropdown
                        menu={{ items: buildTemplateItems(), onClick: handleTemplateSelect }}
                        trigger={['click']}
                        disabled={loading}
                    >
                        <Button icon={<DownloadOutlined />} loading={loading}>
                            {t("candidate.getFormatedCV", "Download formated CV")}
                        </Button>
                    </Dropdown>

                    <Select
                        value={downloadFileType}
                        onChange={setDownloadFileType}
                        style={{ minWidth: 90 }}
                        options={[
                            { value: 'pdf', label: 'PDF' },
                            { value: 'pptx', label: 'PPTX' },
                            { value: 'docx', label: 'DOCX' },
                        ]}
                    />

                    <Tooltip title={!candidate?.hasOriginalCv ? "This profile was created from raw text. No original file exists." : ""}>
                        <Button onClick={getOriginalCV} disabled={!candidate?.hasOriginalCv}>
                            {t("candidate.getOriginalCV", "Get Original CV")}
                        </Button>
                    </Tooltip>
                </div>

            </div>
        </div>
    );
}
