import React, { useState, useEffect } from "react";
import JDTable from "./JDTable/JDTable";
import JDTopBar from "./JDTopBar/JDTopBar"
import JDDetails from "./JDDetails/JDDetails";
import "./JobDescription.css"

import { fetchJobDescription } from "../../utils/fetchJobDescription";
import GenericHeader from "../GenericHeader/GenericHeader";
import { useTranslation } from "react-i18next";


export default function JobDescription({setSelectedCandidate, setIsLoggedIn}) {
    const { i18n } = useTranslation();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [failMessage, setFailMessage] = useState(null);
    const [uploadNew, setUploadNew] = useState(false);

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
            {/* Row 1: Spans full width */}
            <GenericHeader setIsLoggedIn={setIsLoggedIn} navigateLocation='/candidates'/>

            {/* Row 2: Spans full width */}
            <JDTopBar
                setUploadNew={setUploadNew}
            />

            {/* Row 3, Column 1 */}
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