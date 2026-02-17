import React, {useState} from "react"
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Paper, Stack, Typography, Checkbox, Button, FormControl, InputLabel, Select, MenuItem, Tooltip, IconButton } from "@mui/material";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import "./RawMatch.css"
import api from "../../../api";
import { downloadFileFromBlob, getFileNameFromDisposition } from "../../../helperFunctions";
import {useTranslation} from "react-i18next";

export default function RawMatch({ jobId, jobTitle, setSelectedCandidate, matchCandidates, setAiMatchedCandidates }) {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();

    const [selectedIds, setSelectedIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    const systemLanguage = i18n.language?.startsWith('fr') ? 'French' : 'English';

    const handleAIMatch = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("job_id", String(jobId));
        selectedIds.forEach(id => params.append("candidate_id", String(id)));
        params.append("response_language", systemLanguage);

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
        params.append("response_language", systemLanguage);

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
            {t("rawMatch.matchTooltip")}
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', textAlign: "justify" }}>
            <li style={{ marginBottom: "0.2rem"}}>
                {t("rawMatch.left")}
            </li >
            <li style={{ marginBottom: "0.2rem"}}>
                {t("rawMatch.select")}
            </li>
            <li style={{ marginBottom: "0.2rem"}}>
                {t("rawMatch.download")}
            </li>
        </ul>
        </>
    )

    return (
        <Box className="raw-match-box">
            <Typography variant="h4" align="center" gutterBottom>
                {t("rawMatch.title")}
            </Typography>

            <Typography variant="h5" align="center" gutterBottom color="primary">
                {t("rawMatch.job")} {jobTitle}
            </Typography>

            <Box display="flex" justifyContent="center" sx={{ marginBottom: "2vh", marginTop: "2vh" }} columnGap={2}>
                <Button
                    loading={loading}
                    variant="contained"
                    onClick={handleAIMatch}
                >
                    {t("rawMatch.aiBtn")}
                </Button>

                <Button
                    loading={loading}
                    variant="outlined"
                    onClick={handleDocxDownload}
                >
                    {t("rawMatch.downloadBtn")}
                </Button>

                <Tooltip title={renderTooltipContent()} sx={{mr: 2}}>
                    <IconButton>
                        <InfoOutlineIcon/>
                    </IconButton>
                </Tooltip>
            </Box>

            {/* This wrapper enables independent scrolling within the unified box */}
            <Box className="candidates-list-wrapper">
                <Stack spacing={3}>
                    {matchCandidates.map((c) => (
                        <Paper
                            key={c.id}
                            className="candidate-paper"
                            onClick={() => handleSelect(c.id)}
                            sx={{p: 2, cursor: "pointer"}}
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
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                {c.position}
                            </Typography>

                            {c.skills && c.skills.length > 0 && (
                                <>
                                    <Typography variant="body2" sx={{mb: 1, fontWeight: "bold"}}>
                                        {t("rawMatch.matchedSkills")} {c.matched_count}
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        {c.skills.map((s, index) => (
                                            <Chip
                                                key={`${s.skill}-${index}`}
                                                label={`${s.skill} (${s.years} ${t("rawMatch.yrs")})`}
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                            />
                                        ))}
                                    </Stack>
                                </>
                            )}
                        </Paper>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}