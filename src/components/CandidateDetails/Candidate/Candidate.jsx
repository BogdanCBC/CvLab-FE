import './Candidate.css';
import api from "../../../api";
import React, { useState, useEffect } from "react";
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Alert, Box, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {getFileNameFromDisposition, downloadFileFromBlob} from "../../../helperFunctions";
import { fetchCandidates } from '../../../utils/fetchCandidates';

export default function Candidate(props) {
    const [candidate, setCandidate] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [templateType, setTemplateType] = useState('FeelIT');
    const [downloadFileType, setDownloadFileType] = useState('pdf');

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

            console.log("candidate Object:", data);

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
            formData.append("template_type", templateType)

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
                props.selectedHandler(null);
                fetchCandidates().then(sortedCandidates => {
                    props.setCandidates(sortedCandidates);
                });   
            }
        } catch (error) {
            console.error("Error deleting candidate:", error);
        }
    }

    return (
        <Box sx={{ padding: 2 }}>
            {success && (
                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                Candidate data fetched successfully!
                </Alert>
            )}

            <div className="candidate-wrapper">
                <div className="candidate-header">
                <h2>Candidate Name: {candidate ? candidate.firstName : "none"}</h2>
                {localStorage.getItem('role') === "admin" && (
                    <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={deleteCandidate}
                    startIcon={<DeleteForeverIcon />}
                    >
                    Delete
                    </Button>
                )}
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => props.setEditMode(true)}
                    sx={{ marginLeft: 2 }}
                    startIcon={<EditIcon />}
                >
                    Edit
                </Button>
                </div>

                {localStorage.getItem('role') === "admin" && (
                <div className="uploader">
                    <h2>Candidate uploaded by: {candidate ? candidate.username : "Unknown"}</h2>
                </div>
                )}

                <Box className="candidate-data">
                <Typography variant="h6" gutterBottom>
                    Details
                </Typography>
                <Typography>
                    <strong>Phone Number:</strong> {candidate?.phone || "Not Specified"}
                </Typography>
                <Typography>
                    <strong>Email:</strong> {candidate?.email || "Not Specified"}
                </Typography>
                <Typography sx={{ whiteSpace: "pre-line", textAlign: "justify" }}>
                    <strong>Candidate description:</strong>{" "}
                    {candidate ? candidate.description : "none"}
                </Typography>

                <div className="candidate-cv-buttons">
                    <FormControl>
                    <InputLabel id="file-type-select-label">File Type</InputLabel>
                    <Select
                        labelId="file-type-select-label"
                        id="file-type-select"
                        value={downloadFileType}
                        onChange={(e) => setDownloadFileType(e.target.value)}
                    >
                        <MenuItem value="pdf">PDF</MenuItem>
                        <MenuItem value="pptx">PPTX</MenuItem>
                        <MenuItem value="docx">DOCX</MenuItem>
                    </Select>
                    </FormControl>

                    <FormControl>
                    <InputLabel id="template-type-select-label">Template</InputLabel>
                    <Select
                        labelId="template-type-select-label"
                        id="template-type-select"
                        value={templateType}
                        onChange={(e) => setTemplateType(e.target.value)}
                    >
                        <MenuItem value="FeelIT">FeelIT</MenuItem>
                        <MenuItem value="ISE">ISE</MenuItem>
                    </Select>
                    </FormControl>

                    <Button
                    loading={loading}
                    variant="contained"
                    color="primary"
                    onClick={() => getFormattedCV()}
                    >
                    Get formatted CV
                    </Button>

                    <Button
                    variant="contained"
                    color="primary"
                    onClick={() => getOriginalCV()}
                    sx={{ marginLeft: 1 }}
                    >
                    Get original CV
                    </Button>
                </div>
                </Box>
            </div>
        </Box>
    );
}