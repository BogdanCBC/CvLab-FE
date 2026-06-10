import React , { useState } from "react";
import './HomePage.scss';
import Menu from "../Menu/Menu";
import Header from "../Header/Header";
import { useLocation } from 'react-router-dom';
import CandidatesPage from "../CandidatesPage/CandidatesPage";
import JobDescription from "../JobDescription/JobDescription";


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
    const { pathname } = useLocation();
    const [uploadNew, setUploadNew] = useState(false);

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
                            setCandidates={setCandidates}
                            setUploadNew={setUploadNew}/>
                </div>
                <div className="content-area">
                    {pathname === "/candidates" && (
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
                    {pathname === "/job-description" && (
                        <JobDescription
                            setSelectedCandidate={setSelectedCandidate}
                            setIsLoggedIn={setIsLoggedIn}
                            uploadNew={uploadNew}
                            setUploadNew={setUploadNew}
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