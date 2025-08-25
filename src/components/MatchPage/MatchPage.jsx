import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import api from "../../api";
import RawMatch from "./RawMatch/RawMatch";
import './MatchPage.css'
import AiMatch from "./AiMatch/AiMatch";


export default function MatchPage({ setSelectedCandidate }) {
    const { jobId } = useParams();
    
    const [jobTitle, setJobTitle] = useState("Macaroane");
    const [error, setError] = useState(null);
    const [matchCandidates, setMatchCandidates] = useState([]);
    // foloseste asta ca sa randezi ce e in dreapta
    const [aiMatchedCandidates, setAiMatchedCandidates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const jdDetails = await api.get(`/job-description/${jobId}`);
                if (jdDetails.data.success) {
                    setJobTitle(jdDetails.data.data[0].title);
                }
            } catch (err) {
                setJobTitle("");
            }

            const params = new URLSearchParams();
            params.append("job_id", jobId);
            try {
                const resp = await api.get('/job-description/match', { params });
                if (resp.data.success) {
                    setMatchCandidates(resp.data.data);
                } else {
                    setError('Failed to fetch matches');
                }
            } catch (err) {
                setError('Failed to fetch matches');
            }
        };
        fetchData();
    }, [jobId]);

    return (
        <div className="match-page">
            <RawMatch
                jobId={jobId}
                jobTitle={jobTitle}
                setSelectedCandidate={setSelectedCandidate}
                matchCandidates={matchCandidates}
                setAiMatchedCandidates={setAiMatchedCandidates}
            />
            <AiMatch 
                aiMatchedCandidates={aiMatchedCandidates}
                jobTitle={jobTitle}
                setSelectedCandidate={setSelectedCandidate}
            />
        </div>

    );
}