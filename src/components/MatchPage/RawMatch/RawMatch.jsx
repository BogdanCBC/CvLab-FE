import React, {useState} from "react"
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Paper, Stack, Typography, Checkbox, Button, FormControl, InputLabel, Select, MenuItem, Tooltip, IconButton } from "@mui/material";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
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
            // console.log(response)
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
        navigate("/candidates");
    };

    const renderTooltipContent = () => (
        <>
        <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'bold', mb: 0.2, textAlign: "justify" }}
        >
            Match Page:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', textAlign: "justify" }}>
            <li style={{ marginBottom: "0.2rem"}}>
            On the left side, view a list of candidates who have at least one required skill with the required years of experience. Click a candidate to be redirected to their details.
            </li >
            <li style={{ marginBottom: "0.2rem"}}>
            Select desired candidates using the checkboxes, then use the "AI Match" button to generate a rating and a short description of how well each candidate fits the job requirements.
            </li>
            <li style={{ marginBottom: "0.2rem"}}>
            Download a DOCX report containing the same matching information.
            </li>
            <li style={{ marginBottom: "0.2rem"}}>
            The description can be generated in <strong>English</strong> or <strong>French</strong>.
            </li>
        </ul>
        </>
    )

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

                <Tooltip title={renderTooltipContent()} sx={{mr: 2}}>
                    <IconButton>
                        <InfoOutlineIcon/>
                    </IconButton>
                </Tooltip>
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
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 1}}
                        >
                            Email: {c.email || "Not available"}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 1}}
                        >
                            Phone: {c.phone || "Not available"}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{mb: 1, fontWeight: "bold"}}
                        >
                            Matched Skills: {c.matched_count}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {c.skills.map((s, index) => (
                                <Chip 
                                    key={`${s.skill}-${index}`}
                                    label={`${s.skill} (${s.years} yrs)`}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                        {c.languages && c.languages.length > 0 && (
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{mb: 1, fontWeight: "bold", mt: 1}}
                                >
                                    Matched Languages: {c.matched_languages}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    {c.languages.map((l, index) => (
                                        <Chip
                                            key={`${l.language}-${index}`}
                                            label={`${l.language} (Level ${l.level})`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        ) }
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
}