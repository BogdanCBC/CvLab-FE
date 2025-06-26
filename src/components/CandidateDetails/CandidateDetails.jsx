import "./CandidateDetails.css";
import NoCandidate from "./NoCandidate/NoCandidate";
import Candidate from "./Candidate/Candidate";
import EditCandidate from "./EditProfile/EditProfile";

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
            {props.editMode ? (<EditCandidate
                            candidateId={props.selectedCandidate}
                            setEditMode={props.setEditMode}
                        />) : 
                        (<Candidate
                            candidate={props.selectedCandidate}
                            selectedHandler={props.selectedHandler}
                            candidateId={props.selectedCandidate}
                            setEditMode={props.setEditMode}
                            editMode={props.editMode}
                            setCandidates={props.setCandidates}
                        />)}
        </div>
    );
}

export default CandidateDetails