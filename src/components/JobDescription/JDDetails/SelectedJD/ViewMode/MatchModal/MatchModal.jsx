import { Box, Chip, Modal, Paper, Stack, Typography } from "@mui/material";
import "./MatchModal.css"
import { useNavigate } from 'react-router-dom';

export default function MatchModal({ matchModalState, setMatchModalState, matchCandidates, setSelectedCandidate }) {
    const navigate = useNavigate();
    
    const handleSelect = async (key) => {
        setSelectedCandidate(key);
        navigate("/");
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
                <Stack spacing={3}>
                    {matchCandidates.map((c) => (
                        <Paper 
                            key={c.id}
                            className="candidate-paper"
                            onClick={() => handleSelect(c.id)}
                        >
                            <Typography variant="h6">
                                {c.first_name} {c.last_name}
                            </Typography>
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
        </Modal>
    );
}