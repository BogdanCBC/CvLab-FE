import React, { useState } from "react";
import { Box, Button, Chip, FormControl, IconButton, Input, Stack, TextField, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchJobDescription } from "../../../../../utils/fetchJobDescription";
import api from "../../../../../api";
import {useTranslation} from "react-i18next";

export default function EditMode({jobInfo, setEditMode, setJobs, setJobInfo, selectedJob, updateJobInfoFromJobs}) {
    const { t, i18n} = useTranslation();

    const languageLevels = [
        { label: t("jdEditMode.beginner"), value: "Beginner" },
        { label: t("jdEditMode.intermediate"), value: "Intermediate" },
        { label: t("jdEditMode.advanced"), value: "Advanced" },
        { label: t("jdEditMode.proficient"), value: "Proficient" },
        { label: t("jdEditMode.native"), value: "Native" }
    ];

    const [jobData, setJobData] = useState(jobInfo);
    const [skills, setSkills] = useState(jobInfo.skills || []);
    const [newSkill, setNewSkill] = useState("");
    const [yearsInput, setYearsInput] = useState("");

    const [languages, setLanguages] = useState(jobInfo.languages || []);
    const [newLanguage, setNewLanguage] = useState("");
    const [languageLevel, setLanguageLevel] = useState("Beginner");

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
        ]);
        setNewSkill("");
        setYearsInput("");
    };

    const handleAddLanguage = () => {
        if (newLanguage.trim() === "" || languageLevel.trim() === "") return;
        const upperCaseLanguage = String(newLanguage).charAt(0).toUpperCase() + String(newLanguage).slice(1).toLowerCase();
        setLanguages(prev => [
            ...prev,
            { language: upperCaseLanguage.trim(), level: languageLevel.trim()}
        ]);
        setNewLanguage("");
        setLanguageLevel("Beginner");
    }

    const handleDeleteSkill = (index) => {
        setSkills(prev => prev.filter((_, i) => i !== index));
    }

    const handleDeleteLanguage = (index) => {
        setLanguages(prev => prev.filter((_, i) => i != index));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...jobData,
            skills: skills,
            languages: languages
        };

        try {
            const result = await api.put('/job-description', dataToSubmit);
            if(result.data.success) {
                const response = await fetchJobDescription(i18n.language);
                if (response.success) {
                    const jobsList = response.jobs || [];
                    setJobs(jobsList);
                    updateJobInfoFromJobs(jobsList, selectedJob);
                }

                const updateJobInfo = {
                    ...jobData,
                    skills: skills,
                    languages: languages
                };
                setJobInfo(updateJobInfo);
                setEditMode(false);
            }
        } catch(err) {
            console.log("Error updating");
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
                    label={t("jdEditMode.title")}
                    id="title"
                    maxRows={2}
                    value={jobData.title}
                    onChange={handleChange}
                />
                <TextField
                    label={t("jdEditMode.jobDescription")}
                    id="description"
                    value={jobData.description}
                    multiline
                    rows={15}
                    onChange={handleChange}
                />

                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Input
                        placeholder={t("jdEditMode.addSkill")}
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                    />
                    <Input
                        placeholder={t("jdEditMode.years")}
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
                            label={`${s.skill} (${s.years} ${t("jdEditMode.yrs")})`}
                            onClick={() => handleDeleteSkill(index)}
                        />
                    ))}
                </Stack>
      
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Input
                        placeholder={t("jdEditMode.addLanguage")}
                        value={newLanguage}
                        onChange={e => setNewLanguage(e.target.value)}
                    />

                    <TextField
                        select
                        label={t("jdEditMode.level")}
                        value={languageLevel}
                        onChange={e => setLanguageLevel(e.target.value)}
                        size="small"
                        sx={{minWidth: 150}}
                    >
                        {languageLevels.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    
                    <IconButton onClick={handleAddLanguage}>
                        <AddIcon />
                    </IconButton>
                </Box>
                
                <Stack direction="row" spacing={1} mt={2}>
                    {languages.map((l, index) => (
                        <Chip 
                            key={index}
                            label={`${l.language} (Level: ${l.level})`}
                            onClick={() => handleDeleteLanguage(index)}
                        />
                    ))}
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        onClick={() => setEditMode(false)}
                    >
                        {t("jdEditMode.cancel")}
                    </Button>
                    <Button 
                        variant="contained"
                        type="submit"
                    >
                        {t("jdEditMode.confirm")}
                    </Button>
                </Stack>
            </Box>
        </form>
    );
}