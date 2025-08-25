import { Box, Typography, Rating, Stack, Paper } from "@mui/material";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import "./AiMatch.css";
import { useNavigate } from 'react-router-dom';

export default function AiMatch({ aiMatchedCandidates, jobTitle, setSelectedCandidate }) {
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
        navigate("/");
    };

    return (
        
        <Box className={["ai-match-box", isEmpty && "empty"].filter(Boolean).join(" ")}>
            {isEmpty ? (
                <Box className="empty-content" >
                    <PersonOffIcon className="empty-icon" />
                    <Typography align="center">
                        No match performed for job: <b>{jobTitle}</b>. To perform it select candidates from the left panel
                        and click AI MATCH button.
                    </Typography>
                    <Typography align="center">
                        Or download the Docx.
                    </Typography>
                </Box>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Matched Candidates
                    </Typography>
                    <Typography variant="h5" align="center" gutterBottom color="blue">
                        Job: {jobTitle}
                    </Typography>
                    <Box sx={{ flex: 1, overflow: 'auto', mt: 2 }}>
                        <Stack spacing={3} sx={{ maxWidth: '100%', mx: 'auto' }}>
                            {list.map((c) => (
                                <Paper
                                    key={c.candidate_id}
                                    className="candidate-paper"
                                    onClick={() => handleSelect(c.candidate_id)}
                                    elevation={1}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        {c.candidate_name}
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <Rating value={parseStars(c.match_stars)} readOnly max={10} size="small" precision={1} />
                                        <Typography variant="body2" color="text.secondary">
                                            {c.match_stars}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{whiteSpace:"pre-line"}}>
                                        {c.description}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                </>
            ) }
        </Box>
    );
}