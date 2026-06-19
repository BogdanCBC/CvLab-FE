import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Login from '../componentsv2/Login/Login';
import { isTokenValid } from '../utils/auth'
import JobDescription from './JobDescription/JobDescription';
import MatchPage from './MatchPage/MatchPage';
import CandidatesPage from "./CandidatesPage/CandidatesPage";
import AdminPage from "./AdminPage/AdminPage";
import MetricsPage from "./MetricsPage/MetricsPage";
import '../i18n';
import PromptPage from "./PromptPage/PromptPage";
import HomePage from '../componentsv2/Home/HomePage';

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
  const userRole = localStorage.getItem('role');

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
              element={<HomePage
                  setSelectedCandidate={setSelectedCandidate}
                  setIsLoggedIn={setIsLoggedIn}
              />}
           />
           {/* <Route
              path="/match/:jobId"
              element={<MatchPage
                  setSelectedCandidate={setSelectedCandidate}
                  setIsLoggedIn={setIsLoggedIn}
              />}
           /> */}
           <Route
              path="/match/:jobId"
              element={<HomePage
                  setSelectedCandidate={setSelectedCandidate}
                  setIsLoggedIn={setIsLoggedIn}
              />}
           />
           <Route
               path="/candidates"
               element={
                   <HomePage
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
                    <HomePage
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
                        path="/profile"
                        element={<HomePage setIsLoggedIn={setIsLoggedIn} />}
                    />
                    <Route
                        path="/settings"
                        element={<HomePage setIsLoggedIn={setIsLoggedIn} />}
                    />

            {(userRole === 'admin' || userRole === 'superadmin') && (
                <>
                    <Route
                        path="/admin"
                        element={<HomePage setIsLoggedIn={setIsLoggedIn} />}
                    />
                    <Route
                        path="/metrics"
                        element={<HomePage setIsLoggedIn={setIsLoggedIn} />}
                    />
                    <Route
                        path="/admin/prompts"
                        element={<HomePage setIsLoggedIn={setIsLoggedIn} />}
                    />
                </>
            )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
