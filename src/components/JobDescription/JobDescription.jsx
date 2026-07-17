import React, { useState, useEffect } from "react";
import JDTable from "./JDTable/JDTable";
import JDDetails from "./JDDetails/JDDetails";
import "./JobDescription.scss";

import { fetchJobDescription } from "../../utils/fetchJobDescription";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";


export default function JobDescription({ setSelectedCandidate, setIsLoggedIn, uploadNew, setUploadNew }) {
    const { i18n } = useTranslation();
    const { state } = useLocation();
    const clientId = state?.clientId;
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchJobDescription(i18n.language, clientId).then((response) => {
            if (response && response.success) {
                setJobs(response.jobs || []);
            } else {
                setJobs([]);
            }
        });
    }, [i18n.language, clientId]);

    return (
        <div className="job-description-page">
            <JDTable jobs={jobs} setSelectedJob={setSelectedJob} selectedJob={selectedJob} />
            <JDDetails
                selectedJob={selectedJob}
                setSelectedJob={setSelectedJob}
                setJobs={setJobs}
                uploadNew={uploadNew}
                setUploadNew={setUploadNew}
                setSelectedCandidate={setSelectedCandidate}
                clientId={clientId}
            />
        </div>
    );
}
