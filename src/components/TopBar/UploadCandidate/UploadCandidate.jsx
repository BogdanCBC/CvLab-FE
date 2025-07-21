import React, { useState } from 'react';
import { Box, LinearProgress, Typography, IconButton, Button, Stack, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/WarningAmber';


function UploadCandidate({ fileData, onDescriptionChange, onRemove, onKeepDuplicate, onDeleteDuplicate }) {
  const {id, fileName, additionalInfo, progress, status } = fileData;

  const getProgressColor = () => {
    switch (status) {
      case 'loading':
        return 'secondary';
      case 'done':
      case 'success':
      case 'kept':
        return 'success';
      case 'error':
        return 'error';
      case 'duplicate':
        return 'warning';
      default:
        return 'primary';
    }
  }

  const renderStatusChip = () => {
    switch (status) {
      case 'loading':
        return <Chip label='Uploading...' color='info' size='small' />
      case 'done':
      case 'kept':
        return <Chip label='Done' color='success' size='small' icon={<CheckIcon />} />
      case 'error':
        return <Chip label='Error' color='error' size='small' icon={<ErrorIcon />} />
      case 'duplicate':
        return <Chip label='Duplicate' color='warning' size='small' icon={<WarningIcon />} />
      default:
        return null;
    }
  };

  return (
<Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        mb: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2">{fileName}</Typography>
          <Typography
            variant="body2"
            sx={{ mt: 0.5 }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onDescriptionChange(id, e.target.textContent)}
          >
            {additionalInfo || 'Add description…'}
          </Typography>
        </Box>

        {renderStatusChip()}

        <IconButton size="small" color="error" onClick={() => onRemove(id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress}
        color={getProgressColor()}
        sx={{ mt: 1 }}
      />

      {status === 'duplicate' && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => onKeepDuplicate(id)}
          >
            Keep Duplicate
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => onDeleteDuplicate(id)}
          >
            Delete Duplicate
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default UploadCandidate;