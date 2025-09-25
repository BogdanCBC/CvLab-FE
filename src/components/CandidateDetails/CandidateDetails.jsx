import React, { useState } from 'react';
import "./CandidateDetails.css";
import NoCandidate from "./NoCandidate/NoCandidate";
import Candidate from "./Candidate/Candidate";
import EditProfile from "./EditProfile/EditProfile";

function CandidateDetails(props) {
    if (!props.selectedCandidate) {
        return (
            <div className="candidate-details">
                <NoCandidate />
            </div>
        );
    }

    return (
        <div className="candidate-details">
            {props.editMode ? (<EditProfile
                            candidateId={props.selectedCandidate}
                            setEditMode={props.setEditMode}
                        />) : 
                        (<Candidate
                            candidate={props.selectedCandidate}
                            setSelectedCandaidate={props.setSelectedCandidate}
                            candidateId={props.selectedCandidate}
                            setEditMode={props.setEditMode}
                            editMode={props.editMode}
                            setCandidates={props.setCandidates}
                        />)}
        </div>
    );
}

export default CandidateDetails