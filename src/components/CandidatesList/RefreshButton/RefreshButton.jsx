import './RefreshButton.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from '@mui/material';


export default function RefreshButton(props) {
    return (
        <div className='refresh-table-button'>
            <Button onClick={props.fetchDataFunction} variant='contained' color='primary' size='small' sx={{ margin: 1 }}>
                <RefreshIcon />
            </Button>
        </div>
    );
}