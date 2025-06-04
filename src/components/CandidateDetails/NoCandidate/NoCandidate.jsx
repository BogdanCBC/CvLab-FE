import { Box, Typography } from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';


export default function NoCandidate() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
        >
            <PersonOffIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
                No candidate selected
            </Typography>
        </Box>
    );
}