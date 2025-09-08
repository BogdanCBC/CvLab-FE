import React, { useState } from "react";
import { Box, Button, Chip, FormControl, IconButton, Input, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchJobDescription } from "../../../../../utils/fetchJobDescription";
import api from "../../../../../api";

export default function EditMode({jobInfo, setEditMode, setJobs, setJobInfo, selectedJob, updateJobInfoFromJobs}) {
    const [jobData, setJobData] = useState(jobInfo);
    const [skills, setSkills] = useState(jobInfo.skills || []);
    const [newSkill, setNewSkill] = useState("");
    const [yearsInput, setYearsInput] = useState("");

    const handleChange = (e) => {
        const {id, value} = e.target;
        setJobData(prev => ({
            ...prev,
            [id]: value
        }));
    }

    const handleAddSkill = () => {
        if (newSkill.trim() === "" || yearsInput.trim() === "") return;
        setSkills(prev => [
            ...prev,
            { skill: newSkill.trim(), years: parseInt(yearsInput, 10) }
        ])
        setNewSkill("");
        setYearsInput("");
    };

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
                        updateJobInfoFromJobs(response.jobs, selectedJob);
                    }
                }
                const updateJobInfo = {
                    ...jobData,
                    skills: skills
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
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <Input
                            placeholder="Add Skills"
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                        />
                        <Input
                            placeholder="Years"
                            type="number"
                            inputProps={{min: 0}}
                            value={yearsInput}
                            onChange={(e) => setYearsInput(e.target.value)}
                        />
                        <IconButton onClick={handleAddSkill}>
                            <AddIcon />
                        </IconButton>
                    </Box>      
                    <Stack direction="row" spacing={1} mt={2}>
                        {skills.map((s, index) => (
                            <Chip 
                                key={index}
                                label={`${s.skill} (${s.years} yrs)`}
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