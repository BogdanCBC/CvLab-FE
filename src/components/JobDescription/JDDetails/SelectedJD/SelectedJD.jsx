import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import ViewMode from "./ViewMode/ViewMode";
import EditMode from "./EditMode/EditMode";


export default function SelectedJD( {jobInfo, setJobs, setJobInfo, jobId, updateJobInfoFromJobs} ) {
    const [editMode, setEditMode] = useState(false);

    return (
        <Box 
            display="flex"
            flexDirection="column" 
            justifyContent="space-around"
            gap={2}
        >
            {!editMode && (            
                <ViewMode 
                    jobInfo={jobInfo}
                    setEditMode={setEditMode}
                />
            )}

            {
                editMode && (
                    <EditMode 
                        jobInfo={jobInfo}
                        setEditMode={setEditMode}
                        setJobs={setJobs}
                        setJobInfo={setJobInfo}
                        jobId={jobId}
                        updateJobInfoFromJobs={updateJobInfoFromJobs}
                    />
                )
            }
        </Box>
    );
}