import './RefreshButton.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from '@mui/material';
import { fetchCandidates } from '../../../utils/fetchCandidates';
import { useTranslation } from "react-i18next";

export default function RefreshButton(props) {
    const { i18n } = useTranslation();

    return (
            <Button
                onClick={() => {
                    fetchCandidates(i18n.language).then(sortedCandidates => {
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