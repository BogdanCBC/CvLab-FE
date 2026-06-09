import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import ViewMode from "./ViewMode/ViewMode";
import EditMode from "./EditMode/EditMode";


export default function SelectedJD( {
        jobInfo,
        setJobInfo,
        setJobs,
        selectedJob, 
        setSelectedJob, 
        updateJobInfoFromJobs,
        setSelectedCandidate
    }) {
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
                    setJobInfo={setJobInfo}
                    setEditMode={setEditMode}
                    setJobs={setJobs}
                    setSelectedJob={setSelectedJob}
                    setSelectedCandidate={setSelectedCandidate}
                />
            )}

            {editMode && (
                    <EditMode 
                        jobInfo={jobInfo}
                        setEditMode={setEditMode}
                        setJobs={setJobs}
                        setJobInfo={setJobInfo}
                        selectedJob={selectedJob}
                        updateJobInfoFromJobs={updateJobInfoFromJobs}
                    />
                )
            }
        </Box>
    );
}