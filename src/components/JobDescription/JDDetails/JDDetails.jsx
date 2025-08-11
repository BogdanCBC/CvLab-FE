import React, { useState, useEffect } from "react";

import "./JDDetails.css"
import api from "../../../api";
import { Button } from "@mui/material";
import JobInfoForm from "./JobInfoForm/JobInfoForm";
import SelectedJD from "./SelectedJD/SelectedJD";
import NothingSelected from "./NothingSelected/NothingSelected";

export default function JDDetails({ selectedJob, setSelectedJob, setJobs, uploadNew, setUploadNew, setSelectedCandidate }) {
    const [jobInfo, setJobInfo] = useState(null);
    

    useEffect(() => { fetchSelectedCandidate() }, [selectedJob])

    const fetchSelectedCandidate = async () => {
        try {
            if (selectedJob) {
                const response = await api.get(`/job-description/${selectedJob}`);
                const data = response.data

                if (data.success) {
                    setJobInfo(data.data[0]);
                } else {
                    setJobInfo(null);
                }
            }
        } catch (err) {
            setJobInfo(null);
        }
    }

    const updateJobInfoFromJobs = (jobsArray, jobId) => {
        const updated = jobsArray.find(job => job.job_id === jobId);
        if (updated) setJobInfo(updated);
    }

    return (
        <div className="jd-details">
            {/* move button */}
            {(!uploadNew && !jobInfo) && (
                <NothingSelected
                    setUploadNew={setUploadNew}
                />
            )}

            {(!uploadNew && jobInfo) && (
                <SelectedJD
                    jobInfo={jobInfo}
                    setJobInfo={setJobInfo}
                    setJobs={setJobs}
                    selectedJob={selectedJob}
                    setSelectedJob={setSelectedJob}
                    updateJobInfoFromJobs={updateJobInfoFromJobs}
                    setSelectedCandidate={setSelectedCandidate}
                />
            )}

            {uploadNew && (
                <JobInfoForm
                    setJobs={setJobs}
                    setUploadNew={setUploadNew}
                />
            )}
        </div>
    );
}