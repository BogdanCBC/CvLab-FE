import React from "react";
import CandidatesList from "../CandidatesList/CandidatesList";
import CandidateDetails from "../CandidateDetails/CandidateDetails";
import './CandidatesPage.scss';

export default function CandidatesPage({
                                       candidates,
                                       setCandidates,
                                       selectedCandidate,
                                       setSelectedCandidate,
                                       editMode,
                                       setEditMode,
                                       advancedSearch,
                                       setAdvancedSearch,
                                       setIsLoggedIn,
                                   }) {
    return (
        <div className="candidates-page">
            <CandidatesList
                setSelectedCandidate={setSelectedCandidate}
                editMode={editMode}
                setEditMode={setEditMode}
                advancedSearch={advancedSearch}
                setAdvancedSearch={setAdvancedSearch}
                candidates={candidates}
                setCandidates={setCandidates}
                selectedCandidate={selectedCandidate}
            />
            <CandidateDetails
                selectedCandidate={selectedCandidate}
                setSelectedCandidate={setSelectedCandidate}
                editMode={editMode}
                setEditMode={setEditMode}
                setCandidates={setCandidates}
            />
        </div>
    );
}