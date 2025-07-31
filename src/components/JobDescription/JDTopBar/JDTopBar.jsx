import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./JDTopBar.css"

export default function JDTopBar(){
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    }

    return (
        <div className="job-top-bar">
            <h1>Job Description Page</h1>
            <Button
                variant="contained"
                onClick={handleBack}
            >
                Back to candidates
            </Button>

        </div>
    )
}