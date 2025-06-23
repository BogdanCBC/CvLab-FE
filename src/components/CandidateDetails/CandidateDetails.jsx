import React, { useState } from "react";
import "./CandidateDetails.css";
import NoCandidate from "./NoCandidate/NoCandidate";
import Candidate from "./Candidate/Candidate";
import EditCandidate from "./EditProfile/EditProfile";

function CandidateDetails(props) {
    // const [editMode, setEditMode] = useState(false);

    if (!props.candidate) {
        return (
            <div className="candidate-details">
                <NoCandidate />
            </div>
        );
    }

    return (
        <div className="candidate-details">
            {props.editMode ? (<EditCandidate
                            candidateId={props.candidate}
                            setEditMode={props.setEditMode}
                        />) : 
                        (<Candidate
                            candidateId={props.candidate}
                            setEditMode={props.setEditMode}
                            editMode={props.editMode}
                        />)}
        </div>
    );
}

export default CandidateDetails