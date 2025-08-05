import React, {useState, useEffect} from "react";

import "./JDDetails.css"
import api from "../../../api";
import { Button, TextField } from "@mui/material";
import JobInfoForm from "./JobInfoForm/JobInfoForm";

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
                    setJobInfo(data.data);
                } else {
                    setJobInfo(null);
                }
            }
        } catch (err) {
            setJobInfo(null);
        }
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
            
            {uploadNew && (
                <JobInfoForm
                    setJobs={setJobs}
                    setUploadNew={setUploadNew}
                />
            )}           
        </div>
    );
}