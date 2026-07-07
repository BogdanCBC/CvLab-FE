import React, { useState, useEffect } from "react";
import "./JDDetails.scss";
import api from "../../../api";
import JobInfoForm from "./JobInfoForm/JobInfoForm";
import SelectedJD from "./SelectedJD/SelectedJD";
import NothingSelected from "./NothingSelected/NothingSelected";

export default function JDDetails({ selectedJob, setSelectedJob, setJobs, uploadNew, setUploadNew, setSelectedCandidate, clientId }) {

    const [jobInfo, setJobInfo] = useState(null);

    useEffect(() => {
        const fetchSelectedJob = async () => {
            try {
                if (selectedJob) {
                    const response = await api.get(`/job-description/${selectedJob}`);
                    const data = response.data;
                    if (data.success) {
                        setJobInfo(data.data[0]);
                    } else {
                        setJobInfo(null);
                    }
                }
            } catch (err) {
                setJobInfo(null);
            }
        };
        fetchSelectedJob();
    }, [selectedJob]);

    const updateJobInfoFromJobs = (jobsArray, jobId) => {
        const updated = jobsArray.find((job) => job.job_id === jobId);
        if (updated) setJobInfo(updated);
    };

    return (
        <div className="jd-details">
            {!jobInfo && <NothingSelected setUploadNew={setUploadNew} />}

            {jobInfo && (
                <SelectedJD
                    jobInfo={jobInfo}
                    setJobInfo={setJobInfo}
                    setJobs={setJobs}
                    selectedJob={selectedJob}
                    setSelectedJob={setSelectedJob}
                    updateJobInfoFromJobs={updateJobInfoFromJobs}
                    setSelectedCandidate={setSelectedCandidate}
                    clientId={clientId}
                />
            )}

            <JobInfoForm open={uploadNew} setJobs={setJobs} setUploadNew={setUploadNew} clientId={clientId} />
        </div>
    );
}
