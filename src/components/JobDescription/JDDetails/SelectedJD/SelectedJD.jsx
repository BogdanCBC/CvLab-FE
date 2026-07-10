import React, { useState, useEffect } from "react";
import ViewMode from "./ViewMode/ViewMode";
import EditMode from "./EditMode/EditMode";

export default function SelectedJD({
    jobInfo,
    setJobInfo,
    setJobs,
    selectedJob,
    setSelectedJob,
    updateJobInfoFromJobs,
    setSelectedCandidate,
    clientId,
}) {
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setEditMode(false);
    }, [selectedJob]);

    return (
        <div>
            {!editMode && (
                <ViewMode
                    jobInfo={jobInfo}
                    setJobInfo={setJobInfo}
                    setEditMode={setEditMode}
                    setJobs={setJobs}
                    setSelectedJob={setSelectedJob}
                    setSelectedCandidate={setSelectedCandidate}
                    clientId={clientId}
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
            )}
        </div>
    );
}
