import React, { useState } from "react"
import { Box, Typography, Stack, Button, Chip, Alert } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import api from "../../../../../api";
import { fetchJobDescription } from "../../../../../utils/fetchJobDescription";


import { useNavigate } from 'react-router-dom';

export default function ViewMode({ jobInfo, setJobInfo, setEditMode, setJobs, setSelectedJob }) {
    const [noMatchAlert, setNoMatchAlert] = useState(false);
    const [noMatchMessage, setNoMatchMessage] = useState("");

    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const deleteRes = await api.delete("/job-description", {
                params: {
                    job_id: jobInfo.job_id
                }
            });
            if (deleteRes.data.success) {
                try{
                    const jobsRes = await fetchJobDescription();
                    console.log("Fetch result:", jobsRes);
                    if (jobsRes.success && Array.isArray(jobsRes.jobs)) {
                        setJobInfo(null);
                        setSelectedJob(null);
                        setJobs(jobsRes.jobs);
                    } else {
                        setJobs([]);
                        setJobInfo(null);
                        setSelectedJob(null);
                    }
                } catch (err) {
                    setJobInfo(null);
                    setSelectedJob(null);
                    if(err.success){
                        setJobs(err.jobs)
                    }
                }
            } 
        }catch(err) {
            setJobInfo(null);
            setSelectedJob(null);
            setJobs([]);
        }
    }


    const handleNavigate = async () => {
        let matchResp;

        try{
            if (localStorage.getItem('clientName') === 'rgis') {
                matchResp = await api.get('/job-description/match/rgis', {
                    params: {
                        job_id: jobInfo.job_id
                    }
                })
            } else {
                matchResp = await api.get('/job-description/match', {
                    params: {
                        "job_id": jobInfo.job_id
                    }
                });
            }
            if (matchResp.data.data.length === 0) {
                setNoMatchMessage("No candidate matched for this job");
                setNoMatchAlert(true);

                setTimeout(() => {
                    setNoMatchAlert(false);
                    setNoMatchMessage("");
                }, 3000);

            } else {
                if (matchResp.data.success) {
                    navigate(`/match/${jobInfo.job_id}`, {
                        state: {
                            matchedData: matchResp.data.data,
                            isRgis: localStorage.getItem('clientName') === 'rgis'
                        }
                    });
                }
            }
        } catch (err) {
            setNoMatchMessage(err.response.data.message);
            setNoMatchAlert(true);

            setTimeout(() => {
                setNoMatchAlert(false);
                setNoMatchMessage("");
            }, 3000);
        }
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            gap={2}
        >
            {noMatchAlert && (
                <Alert severity="warning">{noMatchMessage}</Alert>
            )}
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Button
                    variant="contained"
                    onClick={() => handleNavigate()}    
                >
                    Match
                </Button>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        onClick={() => setEditMode(true)}
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteForeverIcon />}
                        onClick={() => handleDelete()}
                    >
                        Delete
                    </Button>
                </Stack>
            </Stack>
            <Typography variant="h5" component="div">
                {jobInfo.title}
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
                {jobInfo.description}
            </Typography>
            <Typography variant="h6" component="div">
                SKILLS:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
                {jobInfo.skills.map((s) => (
                    <Chip key={s.skill} label={`${s.skill} (${s.years} yrs)`} />
                ))}
            </Stack>
            {
                jobInfo.languages && jobInfo.languages.length > 0 && (
                    <Box>
                    <Typography variant="h6" component="div">
                        LANGUAGES:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {jobInfo.languages.map((l) => (
                            <Chip key={l.language} label={`${l.language} (Level: ${l.level})`} />
                        ))}
                    </Stack>
                    </Box>
                )
            }
        </Box>
    );
}