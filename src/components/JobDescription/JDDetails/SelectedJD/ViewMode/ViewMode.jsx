import React from "react"
import { Box, Typography, Stack, Button, Chip } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import api from "../../../../../api";
import { fetchJobDescription } from "../../../../../utils/fetchJobDescription";


export default function ViewMode({ jobInfo, setJobInfo, setEditMode, setJobs, setSelectedJob }) {

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

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            gap={2}
        >
            <Stack direction="row" justifyContent="flex-end" alignItems="center">
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
                {jobInfo.skills.map((skill) => (
                    <Chip key={skill} label={skill} />
                ))}
            </Stack>
        </Box>
    );
}