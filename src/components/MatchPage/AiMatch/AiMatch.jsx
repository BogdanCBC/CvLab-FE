import { Box, Typography, Rating, Stack, Paper } from "@mui/material";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import "./AiMatch.css";
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";

export default function AiMatch({ aiMatchedCandidates, jobTitle, setSelectedCandidate }) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const list = Array.isArray(aiMatchedCandidates) ? aiMatchedCandidates : [];
    const isEmpty = list.length === 0;

    const parseStars = (s) => {
        if (typeof s !== "string") return 0;
        const n = parseInt(s.split('/')[0], 10);
        return Number.isNaN(n) ? 0 : n;
    };

    const handleSelect = (key) => {
        setSelectedCandidate(key);
        navigate("/candidates");
    };

    return (
        <Box className={["ai-match-box", isEmpty && "empty"].filter(Boolean).join(" ")}>
            {isEmpty ? (
                <Box className="empty-content">
                    <PersonOffIcon className="empty-icon" />
                    <Typography align="center">
                        {t("aiMatch.noMatch")} <b>{jobTitle}</b>.
                        {t("aiMatch.toPerform")}
                    </Typography>
                    <Typography align="center" sx={{ mt: 1 }}>
                        {t("aiMatch.docxTip")}
                    </Typography>
                </Box>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        {t("aiMatch.aiResults")}
                    </Typography>
                    <Typography variant="h5" align="center" gutterBottom color="primary">
                        {t("aiMatch.job")} {jobTitle}
                    </Typography>

                    {/* Scrollable area for the AI results */}
                    <Box className="matched-results-wrapper">
                        <Stack spacing={3} sx={{ width: '100%', boxSizing: 'border-box' }}>
                            {list.map((c) => (
                                <Paper
                                    key={c.candidate_id}
                                    className="ai-candidate-card" // Added new class for uniform card padding
                                    onClick={() => handleSelect(c.candidate_id)}
                                    elevation={1}
                                >
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        {c.candidate_name}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <Rating value={parseStars(c.match_stars)} readOnly max={10} size="small" precision={1} />
                                        <Typography variant="body2" color="text.secondary">
                                            {c.match_stars}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        className="ai-description-text"
                                    >
                                        {c.description}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                </>
            )}
        </Box>
    );
}