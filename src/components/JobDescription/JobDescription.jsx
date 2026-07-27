import React, { useState, useEffect } from "react";
import JDTable from "./JDTable/JDTable";
import JDDetails from "./JDDetails/JDDetails";
import "./JobDescription.scss";

import { fetchJobDescription } from "../../utils/fetchJobDescription";
import { useTranslation } from "react-i18next";
import { notification } from "antd";
import { useParams, useNavigate } from "react-router-dom";


export default function JobDescription({ setSelectedCandidate, setIsLoggedIn, uploadNew, setUploadNew }) {
    const { t, i18n } = useTranslation();
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        if (!clientId) {
            notification.warning({
                key: "jd-select-client-required",
                title: t("jdEditMode.selectClientRequired", "Select a company"),
                description: t("jdEditMode.selectClientRequiredDescription", "Please select a company before entering the Job description page."),
            });
            navigate("/companies", { replace: true });
        }
    }, [clientId, navigate, t]);

    useEffect(() => {
        if (!clientId) return;
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
