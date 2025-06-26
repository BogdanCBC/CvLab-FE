import { Box, Modal, FormControl, InputLabel, Input, Button, IconButton, Stack, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useEffect } from "react";
import './AdvancedFilters.css';
import api from "../../../api.js";
import qs from 'qs';

export default function AdvancedFilters(props){
    const [formData, setFormData] = useState({
        skills: [],
        position: '',
        experience: '',
        languages: [],
        certifications: []
    })

    const [skillInput, setSkillInput] = useState("")
    const [languageInput, setLanguageInput] = useState("")
    const [certificationInput, setCertificationInput] = useState("")
    const [isValid, setIsValid] = useState(false)

        useEffect(() => {
        const hasInput =
            formData.position.trim() !== '' ||
            formData.experience.trim() !== '' ||
            skillInput.trim() !== '' ||
            languageInput.trim() !== '' ||
            certificationInput.trim() !== '' ||
            formData.skills.length > 0 ||
            formData.languages.length > 0 ||
            formData.certifications.length > 0;

        setIsValid(hasInput);
    }, [
        formData,
        skillInput,
        languageInput,
        certificationInput
    ]);

    const handleSingleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handelAddToList = (field, value, setter) => {
        if (value.trim() === "") return;
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], value.trim()]
        }))
        setter("");
    };

    const handleDelete = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.get('/filters', {
                params: {
                    position: formData.position,
                    experience: formData.experience.trim() === '' ? undefined : parseInt(formData.experience),
                    skills: formData.skills,
                    languages: formData.languages,
                    certifications: formData.certifications
                },
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
            });

            if (response.status === 200) {
                const mappedData = response.data.map(candidate => ({
                    id: candidate.id,
                    firstName: candidate.first_name,
                    lastName: candidate.last_name,
                    experience: candidate.experience,
                    position: candidate.position
                }));

                props.setCandidates(mappedData);
                console.log(mappedData);

                props.setModalState(false);
                setFormData({
                    skills: [],
                    position: '',
                    experience: '',
                    languages: [],
                    certifications: []
                });
            } else {
                alert(response.data.Status || 'Unexpected response');
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const backendMessage = error.response.data?.Status || 'An error occurred';

                if (status === 404 || status === 500) {
                alert(backendMessage);

                } else {
                alert(`Error ${status}: ${backendMessage}`);
                }
            } else {
                alert('Network error or no response from server.');
            }
        }
    };


    return(
        <Modal
            open={props.modalState}
            onClose={() => props.setModalState(false)}
        >
            <Box
                className="modal-box"
            >
                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{display: 'flex', flexDirection: 'column', gap: 2}}
                    >
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="position">Position</InputLabel>
                            <Input 
                                id="position"
                                value={formData.position}
                                onChange={handleSingleChange}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="experience">Experience</InputLabel>
                            <Input
                                id="experience"
                                type="number"
                                inputProps={{ min: 0, step: 1 }}
                                value={formData.experience}
                                onChange={(e) => {
                                    const intVal = parseInt(e.target.value, 10);
                                    if (!isNaN(intVal) || e.target.value === '') {
                                        setFormData(prev => ({
                                            ...prev,
                                            experience: e.target.value
                                        }));
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="skills-input">Skills</InputLabel>
                            <Box sx= {{ display: 'flex', alignItems: 'center'}}>                            
                                <Input 
                                    id="skills-input"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    fullWidth
                                />
                                <IconButton onClick={() => handelAddToList('skills', skillInput, setSkillInput)}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            <Stack direction="row" spacing={1} mt={2}>
                                {formData.skills.map((skill, index) => (
                                    <Chip
                                        key={index}
                                        label={skill}
                                        onClick={() => handleDelete('skills', index)}
                                    />
                                ))}
                            </Stack>
                        </FormControl>
                        
                        <FormControl>
                            <InputLabel htmlFor="languages">Language</InputLabel>
                            <Box sx={{display: 'flex', alignContent: 'center' }}>    
                                <Input
                                    id="languages"
                                    value={languageInput}
                                    onChange={(e) => setLanguageInput(e.target.value)}
                                    fullWidth
                                />
                                <IconButton onClick={() => handelAddToList('languages', languageInput, setLanguageInput)}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            <Stack direction="row" spacing={1} mt={2}>
                                {formData.languages.map((language, index) => (
                                    <Chip 
                                        key={index}
                                        label={language}
                                        onClick={() => handleDelete('languages', index)}
                                    />
                                ))}
                            </Stack>
                        </FormControl>
                        
                        <FormControl>
                            <InputLabel htmlFor="certification">Certification</InputLabel>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Input
                                    id="certification"
                                    value={certificationInput}
                                    onChange={(e) => setCertificationInput(e.target.value)}
                                    fullWidth
                                />
                                <IconButton onClick={() => handelAddToList('certifications', certificationInput, setCertificationInput)}>
                                    <AddIcon />
                                </IconButton>
                            </Box>

                            <Stack direction="row" spacing={1} mt={2}>
                                {formData.certifications.map((certification, index) => (
                                    <Chip 
                                        key={index}
                                        label={certification}
                                        onClick={() => handleDelete('certifications', index)}
                                    />
                                ))}
                            </Stack>
                        </FormControl>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ width: '40%' }}
                                disabled={!isValid}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
}