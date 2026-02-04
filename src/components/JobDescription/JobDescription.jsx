import React, { useState, useEffect } from "react";
import JDTable from "./JDTable/JDTable";
import JDTopBar from "./JDTopBar/JDTopBar"
import JDDetails from "./JDDetails/JDDetails";
import "./JobDescription.css"

import { fetchJobDescription } from "../../utils/fetchJobDescription";
import GenericHeader from "../GenericHeader/GenericHeader";


export default function JobDescription({setSelectedCandidate, setIsLoggedIn}) {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [failMessage, setFailMessage] = useState(null);
    const [uploadNew, setUploadNew] = useState(false);

    useEffect(() => {
        fetchJobDescription().then(response => {
            if(response.success) {
                setJobs(response.jobs);
            } else {
                setFailMessage(response.message)
            }
        })
    }, [])

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