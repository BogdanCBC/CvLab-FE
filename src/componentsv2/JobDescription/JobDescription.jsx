import React, { useState, useEffect } from "react";
import JDTable from "./JDTable/JDTable";
import JDTopBar from "./JDTopBar/JDTopBar"
import JDDetails from "./JDDetails/JDDetails";
import "./JobDescription.css"

import { fetchJobDescription } from "../../utils/fetchJobDescription";
import { useTranslation } from "react-i18next";


export default function JobDescription({setSelectedCandidate, setIsLoggedIn, uploadNew, setUploadNew}) {
    const { i18n } = useTranslation();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [failMessage, setFailMessage] = useState(null);

    useEffect(() => {
        // Pass language to fetch
        fetchJobDescription(i18n.language).then(response => {
            // Check if response exists and has data
            if (response && response.success) {
                // FALLBACK: If response.data is undefined, default to empty array []
                setJobs(response.jobs || []);
            } else {
                setJobs([]); // Ensure it's always an array on failure
                setFailMessage(response?.message || "Failed to load");
            }
        });
    }, [i18n.language]);

    return (
        <div className="job-description-page">
            <JDTable
                jobs={jobs}
                setSelectedJob={setSelectedJob}
            />

            {/* Row 3, Column 2 */}
            <JDDetails
                selectedJob={selectedJob}
                setSelectedJob={setSelectedJob}
                setJobs={setJobs}
                uploadNew={uploadNew}
                setUploadNew={setUploadNew}
                setSelectedCandidate={setSelectedCandidate}
            />
        </div>
    );
}