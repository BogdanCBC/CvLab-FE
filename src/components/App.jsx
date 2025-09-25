import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import { isTokenValid } from '../utils/auth'
import JobDescription from './JobDescription/JobDescription';
import MatchPage from './MatchPage/MatchPage';
import CandidatesPage from "./CandidatesPage/CandidatesPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <Routes>
          <Route
            path="/"
            element={
                isLoggedIn ? <Navigate to="/login"/> : <Navigate to="/candidates" />
            }
          />

        {/* Login Route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/candidates" /> : <Login onLogin={handleLogin} />
          }
        />
        {/* Job description */}
        <Route 
            path="/job-description"
            element={
              isLoggedIn ? 
                <JobDescription
                  setSelectedCandidate={setSelectedCandidate}
                /> : 
                <Navigate to="/login" />
            }
        />
        {/* Match page */}
        <Route 
          path="/match/:jobId"
          element={
            isLoggedIn ? (
              <MatchPage
                  setSelectedCandidate={setSelectedCandidate}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Main App Route */}
        <Route
          path="/candidates"
          element={
            isLoggedIn ? (
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
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
            path="/candidates/:candidateId"
            element={
                isLoggedIn ? (
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
                ) : (
                    <Navigate to="/login" />
                )
            }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
