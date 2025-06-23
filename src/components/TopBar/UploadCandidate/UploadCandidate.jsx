import React from 'react';
import { TextField, IconButton, Paper, Typography, LinearProgress, Chip  } from '@mui/material';
import { Delete, PictureAsPdf, CheckCircle, Error, CloudUpload } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FileContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  backgroundColor: '#f5f5f5',
}));

const FileInfo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: '200px',
});

const DescriptionField = styled(TextField)({
  flexGrow: 1,
});

function UploadCandidate({ fileId, fileName, description, onDescriptionChange, onRemove, uploadStatus }) {
  const handleDescriptionChange = (event) => {
    onDescriptionChange(fileId, event.target.value);
  };

  const getStatusIcon = () => {
    if (!uploadStatus) return null;

    switch (uploadStatus.status) {
      case 'uploading':
        return <CloudUpload color="primary" />;
      case 'completed':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  const getStatusChip = () => {
    if(!uploadStatus) return null;

    switch (uploadStatus.status) {
        case 'uploading':
            return <Chip label="Uploading..." color="primary" size="small" />;
        case 'completed':
            return <Chip label="Completed" color="success" size="small" />;
        case 'error':
            return <Chip label="Failed" color="error" size="small" />;
        default:
            return null;
    }
  };

  const isUploading = uploadStatus?.status === 'uploading';
  const isCompleted = uploadStatus?.status === 'completed';

  return (
    <FileContainer elevation={1}>
      <FileInfo>
        <PictureAsPdf color="error" />
        <Typography variant="body2" noWrap style={{ maxWidth: '150px' }}>
          {fileName}
        </Typography>
        {uploadStatus && (
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '4px'}}>
                {getStatusIcon()}
                {getStatusChip()}
            </div>
        )}
      </FileInfo>
    
      {uploadStatus?.status === 'uploading' && (
        <div style={{ minWidth: '100px'}}>
            <LinearProgress />
        </div>
      )}

      <DescriptionField
        label="Aditional information"
        variant="outlined"
        size="small"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Add aditional information about candidate"
        multiline
        maxRows={2}
        disabled={isUploading || isCompleted}
      />
      
      <IconButton
        onClick={() => onRemove(fileId)}
        color="error"
        size="small"
        aria-label="Remove file"
        disabled={isUploading}
      >
        <Delete />
      </IconButton>
    </FileContainer>
  );
}

export default UploadCandidate;