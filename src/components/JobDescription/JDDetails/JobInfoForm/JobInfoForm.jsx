import { Box, TextField, Stack, Button, Typography, Alert  } from "@mui/material";
import React, { useState } from "react";
import {useTranslation} from "react-i18next";

import api from "../../../../api";
import { fetchJobDescription } from "../../../../utils/fetchJobDescription";


export default function JobInfoForm({setJobs, setUploadNew}) {
    const { i18n } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [failed, setFailed ] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const currentLang = i18n.language?.startsWith('fr') ? 'French' : 'English';

        const payload = {
            ...formData,
            language: currentLang
        };

        try {
            const response = await api.post('/job-description', payload);

            if (response.data.success) {
                setResponseMessage(response.data.message);

                setFormData({
                    title: "",
                    description: "",
                });

                fetchJobDescription(i18n.language).then(response => {
                    if(response.success) {
                        setJobs(response.jobs || []);
                    }
                });
            }
            setSuccess(true);
            setUploading(false);
            
            setTimeout(() => {
                setSuccess(false);
                setResponseMessage("");
            }, 3000); 
        } catch (err) {
            console.log(err.data);
            setResponseMessage(err.data.message)
            setFailed(true);
            setUploading(false);

            setTimeout(() => {
                setFailed(false);
                setResponseMessage("");
            }, 3000);
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
            {success && (
                <Alert severity="success">
                    {responseMessage}
                </Alert>
            )}
            {failed && (
                <Alert severity="error">
                    {responseMessage}
                </Alert>
            )}
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
                    required
                    maxRows={2}
                    fullWidth={true}
                    value={formData.title}
                    onChange={handleChange}
                />

                <TextField
                    label="Job description"
                    id="description"
                    required
                    value={formData.description}
                    multiline
                    rows={10}
                    onChange={handleChange}
                />

                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        onClick={() => handleGoBack()}
                        loading={uploading}
                    >
                        Go back
                    </Button>

                    <Button
                        sx={{alignSelf: "center"}}
                        type="submit"
                        variant="contained"
                        loading={uploading}
                    >
                        Submit
                    </Button>
                </Stack>
            </Box>
        </form>
    )
}