import React, { useState, useEffect } from "react";
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import api from "../../../api";
import './Candidate.css';
import { Button, Alert, Box } from "@mui/material";
import {getFileNameFromDisposition, downloadFileFromBlob} from "../../../helperFunctions";

export default function Candidate(props) {
    const [candidate, setCandidate] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [props.candidateId]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/candidates/${props.candidateId}`);
            const data = {
                id: response.data.id,
                firstName: response.data.first_name || "N/A",
                lastName: response.data.last_name || "N/A",
                description: response.data.description || "N/A",
                experience: response.data.experience || "N/A",
                position: response.data.position || "N/A",
            };

            console.log("Status code:", response.status);

            setCandidate(data);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 3000);

        } catch (error) {
            console.error("Error fetching candidate data:", error);
        }
    }

    const getCandidateCV = async () => {
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

            const generateCandidateCV = await api.post(`/template?id=${props.candidateId}`)
            if (generateCandidateCV) {
                const response = await api.get(`/template/${props.candidateId}?file_type=pdf`, {
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
    
    return (
        <Box
            sx={{
                maxHeight: '550px',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: 2,
            }}
        >
            {success && (
                <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                    Candidate data fetched successfully!
                </Alert>
            )}

            <div className="candidate-wrapper">
                <div className="candidate-header">
                    <h2>Candidate Name: {candidate ? candidate.firstName : "none"}</h2>
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
                <p>Candidate description: {candidate ? candidate.description : "none"}</p>
            </div>
            
            <div className="candidate-cv-buttons">
                <Button
                    loading={loading}
                    variant="contained"
                    color="primary"
                    onClick={() => getFormattedCV()}
                >
                    Get formated CV 
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => getCandidateCV()}
                    sx={{ marginLeft: 1 }}
                >
                    Get original CV 
                </Button>
            </div>

        </Box>
    );
}