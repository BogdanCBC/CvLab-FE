import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './UploadButton.css';
import api from '../../../api';
import {getFileNameFromDisposition, downloadFileFromBlob} from '../../../helperFunctions';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function UploadButton(props) {

    const [loading, setLoading] = useState(false);

    const uploadFile = async (event) => {
        event.preventDefault();
        setLoading(true);
        

        const file = event.target.files[0];
        if (!file) {
            setLoading(false);
            alert("Please select a file to upload.");
            return;
        }
        
        const formData = new FormData();
        formData.append("additional_info", props.textData);
        formData.append("cv_pdf", file);
        
        try {
            const response = await api.post('/template/complete?file_type=pdf', formData, {
                    headers: {
                        "Accept": "application/json"
                    },
                    responseType: 'blob',
                }
            );

            const disposition = response.headers['content-disposition'];
            let filename = getFileNameFromDisposition(disposition);
            const blobFile = new Blob([response.data]);

            downloadFileFromBlob(blobFile, filename);
           
            setLoading(false);
            props.onClose(); 
        }catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file. Please try again.");
            setLoading(false);
            props.onClose();
        }
    }

    return (
        <div className="button-wrapper">
            <Button
                loading={loading}
                loadingPosition="start"
                startIcon={<CloudUploadIcon />} 
                component="label"
                variant="contained"
                tabIndex={-1}
            >
                Upload files
            <VisuallyHiddenInput
                type="file"
                accept="application/pdf"
                onChange={uploadFile}
            />
            </Button>
        </div>
    );
}

export default UploadButton;