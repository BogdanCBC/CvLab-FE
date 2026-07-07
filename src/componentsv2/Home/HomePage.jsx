import React , { useState } from "react";
import './HomePage.scss';
import Menu from "../Menu/Menu";
import Header from "../Header/Header";
import { useLocation } from 'react-router-dom';
import CandidatesPage from "../CandidatesPage/CandidatesPage";
import JobDescription from "../JobDescription/JobDescription";
import AdminPage from "../AdminPage/AdminPage";
import MatchPage from "../MatchPage/MatchPage";
import MetricsPage from "../MetricsPage/MetricsPage";
import PromptPage from "../PromptPage/PromptPage";
import ProfilePage from "../SettingsPage/ProfilePage";
import SettingsPage from "../SettingsPage/SettingsPage";
import CompaniesPage from "../CompaniesPage/CompaniesPage";
import TrackingPage from "../TrackingPage/TrackingPage";
import ArchivePage from "../TrackingPage/ArchivePage";

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
                                       archivedCandidates,
                                       setArchivedCandidates,
                                   }) {
    const { pathname } = useLocation();
    const [uploadNew, setUploadNew] = useState(false);
    const [addCandidateOpen, setAddCandidateOpen] = useState(false);

    return (
        <div className="home-container">
            <div className="left-menu">
                <Menu
                    setIsLoggedIn={setIsLoggedIn}
                />
            </div>
            <div className="main-content">
                {pathname !== "/profile" && pathname !== "/settings" && (
                    <div className="top-menu">
                        <Header candidates={candidates}
                                setCandidates={setCandidates}
                                setUploadNew={setUploadNew}
                                setAddCandidateOpen={setAddCandidateOpen}/>
                    </div>
                )}
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
                    {pathname === "/companies" && (
                        <CompaniesPage
                            setSelectedCandidate={setSelectedCandidate}
                            setIsLoggedIn={setIsLoggedIn}
                            uploadNew={uploadNew}
                            setUploadNew={setUploadNew}
                        />
                    )}
                    {pathname === "/admin" && (
                        <AdminPage setIsLoggedIn={setIsLoggedIn} />
                    )}
                    {pathname.startsWith("/match/") && (
                        <MatchPage
                            setSelectedCandidate={setSelectedCandidate}
                            setIsLoggedIn={setIsLoggedIn}
                        />
                    )}
                    {pathname === "/metrics" && (
                        <MetricsPage setIsLoggedIn={setIsLoggedIn} />
                    )}
                    {pathname === "/admin/prompts" && (
                        <PromptPage setIsLoggedIn={setIsLoggedIn} />
                    )}
                    {pathname === "/profile" && (
                        <ProfilePage />
                    )}
                    {pathname === "/settings" && (
                        <SettingsPage />
                    )}
                    {pathname.startsWith("/tracking/") && !pathname.endsWith("/archive") && (
                        <TrackingPage
                            addCandidateOpen={addCandidateOpen}
                            setAddCandidateOpen={setAddCandidateOpen}
                            archivedCandidates={archivedCandidates}
                            setArchivedCandidates={setArchivedCandidates}
                            setSelectedCandidate={setSelectedCandidate}
                        />
                    )}
                    {/^\/tracking\/[^/]+\/archive$/.test(pathname) && (
                        <ArchivePage
                            archivedCandidates={archivedCandidates || []}
                            setArchivedCandidates={setArchivedCandidates}
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