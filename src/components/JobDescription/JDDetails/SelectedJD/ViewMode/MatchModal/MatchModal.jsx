import React, {useState} from "react"
import { Box, Chip, Modal, Paper, Stack, Typography, Checkbox, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "./MatchModal.css"
import { useNavigate } from 'react-router-dom';
import api from "../../../../../../api";

export default function MatchModal({ matchModalState, setMatchModalState, matchCandidates, setSelectedCandidate, jobId }) {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [fileLanguage, setFileLanguage] = useState("English");
    const [candidates, setCandidates] = useState(matchCandidates || []);

    const handleSelect = async (key) => {
        setSelectedCandidate(key);
        navigate("/");
    }

    const toggleCheckbox = (id) => (event) => {
        event.stopPropagation();
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    const handleFileLanguageChange = (event) => {
        setFileLanguage(event.target.value);
    }

    const handleAIMatch = async () => {
        const params = new URLSearchParams();
        params.append('job_id', String(jobId));
        selectedIds.forEach(id => params.append("candidate_id", String(id)));
        params.append("response_language", fileLanguage);

        try{
            const response = await api.get("/job-description/ai-match", { params });
            if (response.data.success && Array.isArray(response.data.data)) {
                setCandidates(response.data.data);
            }
        } catch (err){
            console.error("Error fetching AI match:", err);
        }
    }
    
    return (
        <Modal
            open={matchModalState}
            onClose={() => setMatchModalState(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                className="modal-box"
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Matched Candidates
                </Typography>
                <Box display="flex" justifyContent="center" sx={{ marginBottom: "2vh", marginTop: "2vh" }} columnGap={2}>
                    <Button
                        variant="contained"
                        onClick={() => handleAIMatch()}
                    >
                        AI Match
                    </Button>

                    <Button>
                        Download docx
                    </Button>

                    <FormControl>
                        <InputLabel id="file-language" sx={{minWidth: 200}}>File Language</InputLabel>
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
                                {c.skills.map((s, index) => (
                                    <Chip 
                                        key={`${s.skill}-${index}`}
                                        label={`${s.skill} (${s.years} yrs)`}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </Box>
        </Modal>
    );
}