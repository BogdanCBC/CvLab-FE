import { Box, Chip, FormControl, IconButton, Paper, TextField, Stack, Button, Typography  } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";

import api from "../../../../api";
import { fetchJobDescription } from "../../../../utils/fetchJobDescription";

export default function JobInfoForm({setJobs, setUploadNew}) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        skills: []
    })
    const [skillInput, setSkillInput] = useState("")

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const handleAddSkill = (value) => {
        if (value.trim() === "") return
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, value.trim()]
        }))
        setSkillInput("")
    }

    const handleDelete = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/job-description', formData);
            console.log(response.data);
            if (response.data.success) {
                setFormData({
                    title: "",
                    description: "",
                    skills: []
                });

                fetchJobDescription().then(response => {
                    if(response.success) {
                        setJobs(response.jobs)
                    }
                });
            }
        } catch (err) {
            console.log(err.data);
        }
    }

    const handleGoBack = () => {
        setFormData({
            title: "",
            description: "",
            skills: []
        });
        
        //Close upload new
        setUploadNew(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box 
                display="flex"
                flexDirection="column" 
                justifyContent="space-around"
                gap={2}
            >
                <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{alignSelf: "center"}}
                >
                    Insert new Job Description
                </Typography>
            
                <TextField
                    label="Title"
                    id="title"
                    maxRows={2}
                    fullWidth={true}
                    value={formData.title}
                    onChange={handleChange}
                />

                <TextField
                    label="Job description"
                    id="description"
                    value={formData.description}
                    multiline
                    rows={10}
                    onChange={handleChange}
                />

                <FormControl>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <TextField
                            id="skills"
                            label="Essential Skills"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            fullWidth
                        />
                        <IconButton 
                            onClick={() => handleAddSkill(skillInput)}
                        > 
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <Stack direction="row" spacing={1} mt={2}>
                        {formData.skills.map((skill, index) => (
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
                        onClick={() => handleGoBack()}
                    >
                        Go back
                    </Button>

                    <Button
                        sx={{alignSelf: "center"}}
                        type="submit"
                        variant="contained"
                    >
                        Submit
                    </Button>
                </Stack>
            </Box>
        </form>
    )
}