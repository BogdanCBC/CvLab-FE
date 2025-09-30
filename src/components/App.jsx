import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Login from './Login/Login';
import { isTokenValid } from '../utils/auth'
import JobDescription from './JobDescription/JobDescription';
import MatchPage from './MatchPage/MatchPage';
import CandidatesPage from "./CandidatesPage/CandidatesPage";

function ProtectedRoute({ isLoggedIn }) {
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}

function LoginGate({ isLoggedIn, onLogin }) {
    const location = useLocation();
    const fromState = location.state?.from;
    const from =
        (fromState?.pathname || '') +
        (fromState?.search || '') +
        (fromState?.hash || '');

    return isLoggedIn
        ? <Navigate to={from || '/candidates'} replace />
        : <Login onLogin={onLogin} />;
}

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
            element={<Navigate to={isLoggedIn ? "/candidates" : "/login"} replace />}
          />

        {/* Login Route */}
        <Route
          path="/login"
          element={<LoginGate isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
        />

        {/* Main App Route */}
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
           <Route
              path="/job-description"
              element={<JobDescription setSelectedCandidate={setSelectedCandidate} />}
           />
           <Route
              path="/match/:jobId"
              element={<MatchPage setSelectedCandidate={setSelectedCandidate} />}
           />
           <Route
               path="/candidates"
               element={
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
                 }
           />
            <Route
                path="/candidates/:candidateId"
                element={
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
                  }
              />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
