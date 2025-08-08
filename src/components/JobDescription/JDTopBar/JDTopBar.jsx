import { Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import "./JDTopBar.css"

export default function JDTopBar({setUploadNew}){
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    }

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

                    <Button
                        variant="contained"
                        onClick={() => setUploadNew(true)}
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        Upload New
                    </Button>
            </Box>
        </div>
    )
}