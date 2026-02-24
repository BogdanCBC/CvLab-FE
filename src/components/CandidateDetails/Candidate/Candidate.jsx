import './Candidate.css';
import api from "../../../api";
import React, { useState, useEffect } from "react";
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import {
    Button,
    Alert,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Tooltip,
    IconButton
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {getFileNameFromDisposition, downloadFileFromBlob} from "../../../helperFunctions";
import { fetchCandidates } from '../../../utils/fetchCandidates';
import {getTenantConfig} from "../../../utils/tenantConfig";
import {useTranslation} from "react-i18next";

export default function Candidate(props) {
    const {t} = useTranslation();

    const [candidate, setCandidate] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [templateType, setTemplateType] = useState('');
    const [downloadFileType, setDownloadFileType] = useState('');

    const [iseSubType, setIseSubType] = useState('');

    const BASE_URL = process.env.REACT_APP_BASE_URL + '/candidates';

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

    useEffect(() => {
        fetchData();
    }, [props.candidateId]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/candidates/${props.candidateId}`);
            const data = {
                id: response.data.id,
                firstName: response.data.first_name || "N/A",
                description: response.data.description || "N/A",
                username: response.data.username || "N/A",
                email: response.data.email || "N/A",
                phone: response.data.phone || "N/A"
            };

            // UNCOMMENT TO SEE CANDIDATE INFO
            // console.log("candidate Object:", data);

            setCandidate(data);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 3000);

        } catch (error) {
            console.error("Error fetching candidate data:", error);
        }
    }

    const getOriginalCV = async () => {
        try{
            const response = await api.get(`/candidates/cv/${props.candidateId}`, {
                    responseType: 'blob',
                }
            );

            const disposition = response.headers['content-disposition'];
            let filename = getFileNameFromDisposition(disposition);
            const blobFile = new Blob([response.data]);

            downloadFileFromBlob(blobFile, filename);
        }catch (error) {
            console.error("Error downloading CV:", error);
            alert("An error occurred while downloading the CV. Please try again.");
        }
    }

    const getFormattedCV = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("candidate_id", props.candidateId);
            formData.append("template_type", templateType === "ISE" ? iseSubType : templateType)

            const generateCandidateCV = await api.post(`/template`, formData, {
                headers: { "Content-Type" : "application/json" }
            })
            if (generateCandidateCV) {
                const response = await api.get(`/template/${props.candidateId}?file_type=${downloadFileType}`, {
                    responseType: 'blob',
                })

                const disposition = response.headers['content-disposition'];
                let filename = getFileNameFromDisposition(disposition);
                const blobFile = new Blob([response.data]);

                downloadFileFromBlob(blobFile, filename);

                setLoading(false);
            } else {
                console.log('Failed to generate new CV.')
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching formatted CV:", error);
            alert("An error occurred while fetching the formatted CV. Please try again.");
            setLoading(false)
        }
    }
    
    const deleteCandidate = async () => {
        try {
            const response = await api.delete(`/candidates?id=${props.candidateId}`);
            if (response.status === 200) {
                props.setSelectedCadnidate(null);
                fetchCandidates().then(sortedCandidates => {
                    props.setCandidates(sortedCandidates);
                });   
            }
        } catch (error) {
            console.error("Error deleting candidate:", error);
        }
    }

    const handleCopyLink = async () => {
        try {
            const contentToCopy = BASE_URL + `/${props.candidateId}`;
            await navigator.clipboard.writeText(contentToCopy);
        } catch (err) {
            console.log(`Failed to copy! Error: ${err}`)
        }
    }

    const disableGetFormatted = ((downloadFileType === '') || (templateType === '')) || loading || (templateType === "ISE" && !iseSubType)

    const renderTooltipContent = () => (
        <>
        <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", mb: 0.2, textAlign: "justify" }}
        >
            {t("candidate.description")}
        </Typography>
        <ul style={{ margin: 0, paddingLeft: "1.2rem", textAlign: "justify" }}>
            <li style={{ marginBottom: "0.2rem"}}>{t("candidate.seeCandidateTooltip")}</li>
            <li style={{ marginBottom: "0.2rem"}}>
                {t("candidate.getFormatedTooltip")}
            </li>
            <li style={{ marginBottom: "0.2rem"}}>{t("candidate.downloadTooltip")}</li>
            <li style={{ marginBottom: "0.2rem"}}>
                {t("candidate.editTooltip")}
            </li>
        </ul>
        </>
    )

    return (
        <Box sx={{ padding: 2 }}>
            {success && (
                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                    {t("candidate.successFetchMessage")}
                </Alert>
            )}

            <div className="candidate-wrapper">
                <div className="candidate-header">
                <h2>{ t("candidate.candidateName") } {candidate ? candidate.firstName : t("candidate.noName")}</h2>
                
                <Tooltip sx={{mr: 2}} title={renderTooltipContent()}>
                    <IconButton>
                        <InfoOutlineIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip sx={{mr: 2}} title={t("candidate.clipboard")}>
                    <Button onClick={handleCopyLink}>
                        <ContentCopyIcon />
                    </Button>
                </Tooltip>

                {(localStorage.getItem('role') === "admin" || localStorage.getItem('role') === "superadmin") && (
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={deleteCandidate}
                        startIcon={<DeleteForeverIcon />}
                    >
                        {t("candidate.deleteBtn")}
                    </Button>
                )}
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => props.setEditMode(true)}
                    sx={{ marginLeft: 2 }}
                    startIcon={<EditIcon />}
                >
                    {t("candidate.editButton")}
                </Button>
                </div>

                {(localStorage.getItem('role') === "admin" || localStorage.getItem('role') === "superadmin") && (
                <div className="uploader">
                    <h2>{t("candidate.uploadedBy")} {candidate ? candidate.username : "Unknown"}</h2>
                </div>
                )}

                <Box className="candidate-data">
                <Typography variant="h6" gutterBottom>
                    {t("candidate.details")}
                </Typography>
                <Typography>
                    <strong>{t("candidate.phoneNo")}</strong> {candidate?.phone || "Not Specified"}
                </Typography>
                <Typography>
                    <strong>{t("candidate.email")}</strong> {candidate?.email || "Not Specified"}
                </Typography>
                <Typography sx={{ whiteSpace: "pre-line", textAlign: "justify" }}>
                    <strong>{t("candidate.description")}</strong>{" "}
                    {candidate ? candidate.description : "none"}
                </Typography>

                <div className="candidate-cv-buttons">
                    <FormControl sx={{ minWidth: 130 }}>
                        <InputLabel id="file-type-select-label">{t("candidate.fileFormat")}</InputLabel>
                        <Select
                            labelId="file-type-select-label"
                            id="file-type-select"
                            value={downloadFileType}
                            onChange={(e) => setDownloadFileType(e.target.value)}
                            label={t("candidate.fileFormat")}
                        >
                            <MenuItem value="pdf">PDF</MenuItem>
                            <MenuItem value="pptx">PPTX</MenuItem>
                            <MenuItem value="docx">DOCX</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 140 }}>
                        <InputLabel id="template-type-select-label">Template</InputLabel>
                        <Select
                            labelId="template-type-select-label"
                            id="template-type-select"
                            value={templateType}
                            onChange={handleChangeTemplateType}
                            label={t("candidate.template")}
                        >
                            {getTenantConfig().templates.map(t => (
                                <MenuItem key={t.toLowerCase()} value={t}>{t}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {templateType === "ISE" && (
                        <FormControl sx={{ minWidth: 140 }}>
                            <InputLabel id="ise-subtype-label">ISE Template</InputLabel>
                            <Select
                                labelId="ise-subtype-label"
                                id="ise-subtype-select"
                                value={iseSubType}
                                onChange={handleChangeIseSubType}
                                label="ISE"
                            >
                                <MenuItem value="ISE1">{t("candidate.template")} 1</MenuItem>
                                <MenuItem value="ISE2">{t("candidate.template")} 2</MenuItem>
                                <MenuItem value="ISE3">{t("candidate.template")} 3</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    <Button
                        loading={loading}
                        variant="contained"
                        color="primary"
                        disabled={disableGetFormatted}
                        onClick={() => getFormattedCV()}
                    >
                        {t("candidate.getFormatedCV")}
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => getOriginalCV()}
                        sx={{ marginLeft: 1 }}
                    >
                        {t("candidate.getOriginalCV")}
                    </Button>
                </div>
                </Box>
            </div>
        </Box>
    );
}