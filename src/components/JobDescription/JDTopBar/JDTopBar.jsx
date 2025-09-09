import { Box, Button, Tooltip, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./JDTopBar.css"

export default function JDTopBar({setUploadNew}){
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    }

    const renderTooltipContent = () => (
        <>
        <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'bold', mb: 0.2, textAlign: "justify" }}
        >
            Job Description Page:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', textAlign: "justify" }}>
            <li style={{ marginBottom: "0.2rem"}}>View all uploaded jobs in a clear table format</li>
            <li style={{ marginBottom: "0.2rem"}}>Click the "Upload New" button to add a new job with its title and description</li>
            <li style={{ marginBottom: "0.2rem"}}>Select an existing job to preview it and use the edit option to modify its details</li>
            <li style={{ marginBottom: "0.2rem"}}>Use the "Match" button to find candidates who could be a fit for the selected job</li>
        </ul>
        </>
)

    return (
        <div className="job-top-bar">
            <h1>Job Description Page</h1>
            <Box
                display="flex"
                justifyContent="space-between"
            >
                    <Button
                        variant="contained"
                        onClick={handleBack}
                    >
                        Back to candidates
                    </Button>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title={renderTooltipContent()} sx={{mr: 2}}>
                            <IconButton>
                                <InfoOutlineIcon/>
                            </IconButton>
                        </Tooltip>
                        
                        <Button
                            variant="contained"
                            onClick={() => setUploadNew(true)}
                            startIcon={<AddCircleOutlineIcon />}
                        >
                            Upload New
                        </Button>
                    </Box>
            </Box>
        </div>
    )
}