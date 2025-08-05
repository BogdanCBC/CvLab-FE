import React, {useState, useEffect} from "react";

import "./JDDetails.css"
import api from "../../../api";
import { Button } from "@mui/material";
import JobInfoForm from "./JobInfoForm/JobInfoForm";
import SelectedJD from "./SelectedJD/SelectedJD";

export default function JDDetails( {selectedJob, setSelectedCandidate, setJobs} ) {
    const [jobInfo, setJobInfo] = useState(null);
    const [uploadNew, setUploadNew] = useState(false);

    useEffect(() => {fetchSelectedCandidate()}, [selectedJob])

    const fetchSelectedCandidate = async () => {
        try{
            if (selectedJob) {
                const response = await api.get(`/job-description/${selectedJob}`);
                const data = response.data

                if(data.success) {
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

    return(
        <div className="jd-details">
            {!uploadNew && (
                <Button
                    variant="contained"
                    onClick={() => setUploadNew(true)}
                > 
                    Upload new 
                </Button>
            )}

            {(!uploadNew && jobInfo) && (
                <SelectedJD 
                    jobInfo={jobInfo}
                    setJobs={setJobs}
                    setJobInfo={setJobInfo}
                    jobId={selectedJob}
                    updateJobInfoFromJobs={updateJobInfoFromJobs}
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