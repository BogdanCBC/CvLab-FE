import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  TextField,
  IconButton,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import './UploadCandidate.css';


function UploadCandidate({ fileData, onDescriptionChange, onRemove }) {
  const {id, fileName, additionalInfo, progress, status } = fileData;

  const getProgressColor = () => {
    if (status === 'error') return 'error';
    if (status === 'success') return 'success';
    return 'primary';
  }

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="subtitle1" 
            noWrap 
            sx={{ maxWidth: '80%' }}
          >
            {fileName}
          </Typography>
          
          {status === 'loading' && <Typography color="primary">Processing...</Typography>}
          {status === 'done' && (
            <Typography color="green" sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutlineIcon sx={{ mr: 1 }} /> Completed
            </Typography>
          )}
          {status === 'error' && (
            <Typography color="error" sx={{ display: 'flex', alignItems: 'center' }}>
              <ErrorOutlineIcon sx={{ mr: 1 }} /> Failed
            </Typography>
          )}
          {status === 'duplicate' && (
            <Typography color="orange" sx={{ display: 'flex', alignItems: 'center' }}>
              ⚠ Duplicate Detected
            </Typography>
          )}

          
          <IconButton aria-label="delete" onClick={() => onRemove(id)}>
            <DeleteIcon />
          </IconButton>
        </div>

        <LinearProgress 
          variant="determinate"
          value={progress}
          color={getProgressColor()}
          sx={{ mt: 2, mb: 2 }}
        />

        <TextField
          fullWidth
          label="Additional Info"
          variant="outlined"
          size="small"
          value={additionalInfo}
          onChange={(e) => onDescriptionChange(id, e.target.value)}
        />
      </CardContent>
    </Card>
  );
}

export default UploadCandidate;