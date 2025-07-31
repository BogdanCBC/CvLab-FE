import React, { useState, useEffect } from "react";
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import JDTable from "./JDTable/JDTable";
import JDTopBar from "./JDTopBar/JDTopBar"
import "./JobDescription.css"

import { fetchJobDescription } from "../../utils/fetchJobDescription";

export default function JobDescription() {

    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [failMessage, setFailMessage] = useState(null);

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
            <JDTopBar />
            <JDTable 
                jobs={jobs}
                setSelectedJob={setSelectedJob}
            />
        </div>
    );
}