import React, {useState} from "react"
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Paper, Stack, Typography, Checkbox, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import "./RawMatch.css"
import api from "../../../api";
import { downloadFileFromBlob, getFileNameFromDisposition } from "../../../helperFunctions";

export default function RawMatch({ jobId, jobTitle, setSelectedCandidate, matchCandidates, setAiMatchedCandidates }) {
    const navigate = useNavigate();
    const [fileLanguage, setFileLanguage] = useState("English");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    const handleAIMatch = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("job_id", String(jobId));
        selectedIds.forEach(id => params.append("candidate_id", String(id)));
        params.append("response_language", fileLanguage);

        try{
            const response = await api.get("/job-description/ai-match", { params });
            if(response.data.success){
                setAiMatchedCandidates(response.data.data)
            }
            setLoading(false);
        } catch (err){
            setLoading(false)
        }
    };

    const handleDocxDownload = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("job_id", String(jobId));
        selectedIds.forEach(id => params.append("candidate_id", String(id)));
        params.append("response_language", fileLanguage);

        try {
            const response = await api.get("/job-description/generate-docx", { 
                params,
                responseType: "blob"
            });
            console.log(response)
            const disposition = response.headers['content-disposition'];
            const fileName = getFileNameFromDisposition(disposition);

            downloadFileFromBlob(response.data, fileName);
            setLoading(false);
        } catch (err){
            setLoading(false);
        }
    }

    const handleFileLanguageChange = (event) => {
        setFileLanguage(event.target.value);
    };

    const toggleCheckbox = (id) => (event) => {
        event.stopPropagation();
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSelect = (key) => {
        setSelectedCandidate(key);
        navigate("/");
    };

    return (
        <Box
            className="raw-match-box"
            sx={{
                maxWidth: 700,
                m: "32px auto",
                background: "white",
                boxShadow: 3,
                borderRadius: 2,
                p: 4
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Matched Candidates
            </Typography>

            <Typography variant="h5" align="center" gutterBottom color="blue">
                Job: {jobTitle}
            </Typography>

            <Box display="flex" justifyContent="center" sx={{ marginBottom: "2vh", marginTop: "2vh" }} columnGap={2}>
                <Box 
                    display="flex"
                    justifyContent="center"
                >
                    <Button 
                        variant="outlined"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                </Box>
                <Button
                    loading={loading}
                    variant="contained"
                    onClick={handleAIMatch}
                >
                    AI Match
                </Button>

                <Button
                    loading={loading}
                    variant="outlined"
                    onClick={handleDocxDownload}
                >
                    Download docx
                </Button>

                <FormControl>
                    <InputLabel id="file-language-label" sx={{minWidth: 200}}>File Language</InputLabel>
                    <Select
                        sx={{minWidth: 120}}
                        labelId="file-language-label"
                        id="file-language-select"
                        value={fileLanguage}
                        onChange={handleFileLanguageChange}
                        label="File Type"
                    >
                        <MenuItem value="English" sx={{width: 120}}>English</MenuItem>
                        <MenuItem value="French" sx={{width: 120}}>French</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Stack spacing={3}>
                {matchCandidates.map((c) => (
                    <Paper 
                        key={c.id}
                        className="candidate-paper"
                        onClick={() => handleSelect(c.id)}
                        sx={{p:2, cursor:"pointer"}}
                    >
                        <Box display="flex" alignItems="center" columnGap={1}>
                            <Checkbox
                                size="small"
                                checked={selectedIds.has(c.id)}
                                onChange={toggleCheckbox(c.id)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Typography variant="h6">
                                {c.first_name} {c.last_name}
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            {c.position}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{mb: 1, fontWeight: "bold"}}
                        >
                            Matched Skills: {c.matched_count}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {c.skills.map(skill => (
                                <Chip 
                                    key={skill}
                                    label={skill}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
}