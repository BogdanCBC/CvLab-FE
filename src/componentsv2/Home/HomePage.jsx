import React from "react";
import './HomePage.scss';
import Menu from "../Menu/Menu";
import Header from "../Header/Header";
import { useActivePage } from '../../store/activePageStore';
import CandidatesPage from "../CandidatesPage/CandidatesPage";


export default function HomePage({
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
    const { activePage, setActivePage } = useActivePage();

    return (
        <div className="home-container">
            <div className="left-menu">
                <Menu
                    setIsLoggedIn={setIsLoggedIn}
                />
            </div>
            <div className="main-content">
                <div className="top-menu">
                    <Header candidates={candidates}
                            setCandidates={setCandidates}/>
                </div>
                <div className="content-area">
                    {activePage === "cv" && (
                        <CandidatesPage
                            candidates={candidates}
                            setCandidates={setCandidates}
                            selectedCandidate={selectedCandidate}
                            setSelectedCandidate={setSelectedCandidate}
                            editMode={editMode}
                            setEditMode={setEditMode}
                            advancedSearch={advancedSearch}
                            setAdvancedSearch={setAdvancedSearch}
                            setIsLoggedIn={setIsLoggedIn}
                        />
                    )}
                </div>
             </div>
        </div>


        // <div className="candidates-page">
        //     <TopBar
        //         candidates={candidates}
        //         setCandidates={setCandidates}
        //         setIsLoggedIn={setIsLoggedIn}
        //     />
        //     <CandidatesList
        //         setSelectedCandidate={setSelectedCandidate}
        //         editMode={editMode}
        //         setEditMode={setEditMode}
        //         advancedSearch={advancedSearch}
        //         setAdvancedSearch={setAdvancedSearch}
        //         candidates={candidates}
        //         setCandidates={setCandidates}
        //     />
        //     <CandidateDetails
        //         selectedCandidate={selectedCandidate}
        //         setSelectedCandidate={setSelectedCandidate}
        //         editMode={editMode}
        //         setEditMode={setEditMode}
        //         setCandidates={setCandidates}
        //     />
        // </div>
    );
}