import React, { useState } from "react";
import { Box, Button, Chip, FormControl, IconButton, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchJobDescription } from "../../../../../utils/fetchJobDescription";
import api from "../../../../../api";

export default function EditMode({jobInfo, setEditMode, setJobs, setJobInfo, jobId, updateJobInfoFromJobs}) {
    const [jobData, setJobData] = useState(jobInfo);
    const [skills, setSkills] = useState(
        jobInfo.skills ? jobInfo.skills.split(",").map(s => s.trim()) : []
    );
    const [newSkill, setNewSkill] = useState("");

    const handleChange = (e) => {
        const {id, value} = e.target;
        setJobData(prev => ({
            ...prev,
            [id]: value
        }));
    }

    const handleAddSkill = (value) => {
        if (newSkill.trim() === "" || skills.includes(newSkill.trim())) return;
        setSkills(prev => [...prev, newSkill.trim()]);
        setNewSkill("");
    }

    const handleDelete = (index) => {
        setSkills(prev => prev.filter((_, i) => i !== index));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...jobData,
            skills: skills
        };
        
        try {
            const result = await api.put('/job-description', dataToSubmit);
            if(result.data.success) {
                if (result.data.success) {
                    const response = await fetchJobDescription();
                    if (response.success) {
                        setJobs(response.jobs);
                        updateJobInfoFromJobs(response.jobs, jobId);
                    }
                }
                const updateJobInfo = {
                    ...jobData,
                    skills: skills.join(",")
                };
                setJobInfo(updateJobInfo);
                setEditMode(false);
            }
        } catch(err) {
            console.log("Crapaaa");
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <Box
                display="flex"
                flexDirection="column" 
                justifyContent="space-around"
                gap={2}
            >
                <TextField
                    label="Title"
                    id="title"
                    maxRows={2}
                    value={jobData.title}
                    onChange={handleChange}
                />
                <TextField
                    label="Job description"
                    id="description"
                    value={jobData.description}
                    multiline
                    rows={15}
                    onChange={handleChange}
                />

                <FormControl>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <TextField
                            label="Add Skills"
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                            fullWidth
                        />
                        <IconButton onClick={handleAddSkill}>
                            <AddIcon />
                        </IconButton>
                    </Box>      
                    <Stack direction="row" spacing={1} mt={2}>
                        {skills.map((skill, index) => (
                            <Chip 
                                key={index}
                                label={skill}
                                onClick={() => handleDelete(index)}
                            />
                        ))}

                    </Stack>
                </FormControl>


                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        onClick={() => setEditMode(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained"
                        type="submit"
                    >
                        Confirm
                    </Button>
                </Stack>
            </Box>
        </form>
    );
}