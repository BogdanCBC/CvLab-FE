import { 
  Box, Modal, FormControl, InputLabel, Input, Button, IconButton, Stack, Chip, FormLabel,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useEffect } from "react";
import './AdvancedFilters.css';
import api from "../../../api.js";
import { useTranslation } from 'react-i18next';

export default function AdvancedFilters(props){
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        skills: [],
        position: '',
        experience: '',
        languages: [],
        certifications: []
    });
    const [skillInput, setSkillInput] = useState("");
    const [yearsInput, setYearsInput] = useState("");
    const [languageInput, setLanguageInput] = useState("");
    const [certificationInput, setCertificationInput] = useState("");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const hasInput =
            formData.position.trim() !== '' ||
            formData.experience.trim() !== '' ||
            skillInput.trim() !== '' ||
            yearsInput.trim() !== '' ||
            languageInput.trim() !== '' ||
            certificationInput.trim() !== '' ||
            formData.skills.length > 0 ||
            formData.languages.length > 0 ||
            formData.certifications.length > 0;

        setIsValid(hasInput);
    }, [formData, skillInput, yearsInput, languageInput, certificationInput]);

    const handleSingleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleAddSkill = () => {
        if (skillInput.trim() === "" || yearsInput.trim() === "") return;
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, { skill: skillInput.trim(), years: parseInt(yearsInput, 10) }]
        }));
        setSkillInput("");
        setYearsInput("");
    };

    const handelAddToList = (field, value, setter) => {
        if (value.trim() === "") return;
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], value.trim()]
        }));
        setter("");
    };

    const handleDelete = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentLang = i18n.language?.startsWith('fr') ? 'French' : 'English';

        try {
            const response = await api.post(`/filters?language=${currentLang}`, {
                position: formData.position,
                experience: formData.experience.trim() === '' ? undefined : parseInt(formData.experience, 10),
                skills: formData.skills,
                languages: formData.languages,
                certifications: formData.certifications
            });

            if (response.status === 200) {
                const mappedData = response.data.map(candidate => ({
                    id: candidate.id,
                    firstName: candidate.first_name,
                    lastName: candidate.last_name,
                    experience: candidate.experience,
                    position: candidate.position,
                    language: candidate.language,
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
            <Box className="modal-box">
                <Typography display="flex" justifyContent="center" variant="h4">
                    {t('advancedFilters.title')}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        {/* Position */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="position"> {t('advancedFilters.position')} </InputLabel>
                            <Input 
                                id="position"
                                value={formData.position}
                                onChange={handleSingleChange}
                            />
                        </FormControl>

                        {/* General Experience */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel htmlFor="experience"> {t('advancedFilters.experience')} </InputLabel>
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

                        {/* Skills with years */}
                        <FormControl fullWidth margin="normal">
                            <FormLabel> {t('advancedFilters.skills')} </FormLabel>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>                            
                                <Input 
                                    placeholder={t('advancedFilters.skillPlaceholder')}
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                />
                                <Input
                                    placeholder={t('advancedFilters.yearsPlaceholder')}
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    value={yearsInput}
                                    onChange={(e) => setYearsInput(e.target.value)}
                                    sx={{ width: '100px' }}
                                />
                                <IconButton onClick={handleAddSkill}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                                {formData.skills.map((s, index) => (
                                    <Chip
                                        key={index}
                                        label={`${s.skill} (${s.years} ${t('advancedFilters.years')})`}
                                        onClick={() => handleDelete('skills', index)}
                                    />
                                ))}
                            </Stack>
                        </FormControl>
                        
                        {/* Languages */}
                        <FormControl>
                            <InputLabel htmlFor="languages">{t('advancedFilters.language')}</InputLabel>
                            <Box sx={{display: 'flex', alignContent: 'center'}}>    
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
                        
                        {/* Certifications */}
                        <FormControl>
                            <InputLabel htmlFor="certification">{t('advancedFilters.certification')}</InputLabel>
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
                        
                        {/* Submit */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ width: '40%' }}
                                disabled={!isValid}
                            >
                                {t('advancedFilters.submitBtn')}
                            </Button>
                        </Box>
                    </Box>
                </form>

                <Typography display="flex" justifyContent="center" variant="h7" sx={{ mt: 6, textAlign: "justify" }}>
                    {t('advancedFilters.tip')}
                </Typography>
                
                <Typography display="flex" justifyContent="center" variant="h7" sx={{ mt: 1, textAlign: "justify" }}>
                   <b> {t('advancedFilters.boldTip')} </b>
                </Typography>
            </Box>
        </Modal>
    );
}
