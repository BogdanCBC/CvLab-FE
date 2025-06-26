import './RefreshButton.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from '@mui/material';
import { fetchCandidates } from '../../../utils/fetchCandidates';

export default function RefreshButton(props) {
    return (
            <Button
                onClick={() => {
                    fetchCandidates().then(sortedCandidates => {
                        props.setCandidates(sortedCandidates);
                    });
                }}
                variant='contained'
                color='primary'
                size='small'
                sx={{ margin: 1 }}
            >
                <RefreshIcon />
            </Button>
    );
}