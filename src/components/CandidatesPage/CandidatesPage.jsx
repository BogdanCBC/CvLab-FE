import React from "react";
import TopBar from "../TopBar/TopBar";
import CandidatesList from "../CandidatesList/CandidatesList";
import CandidateDetails from "../CandidateDetails/CandidateDetails";
import './CandidatesPage.css';

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
            <TopBar
                candidates={candidates}
                setCandidates={setCandidates}
                setIsLoggedIn={setIsLoggedIn}
            />
            <CandidatesList
                setSelectedCandidate={setSelectedCandidate}
                editMode={editMode}
                setEditMode={setEditMode}
                advancedSearch={advancedSearch}
                setAdvancedSearch={setAdvancedSearch}
                candidates={candidates}
                setCandidates={setCandidates}
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