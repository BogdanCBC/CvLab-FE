import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Login from './Login/Login';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import { isTokenValid } from '../utils/auth'
import '../i18n';
import HomePage from './Home/HomePage';
import LandingPage from './LandingPage/LandingPage';
import BlogListPage from './BlogPage/BlogListPage';
import ArticlePage from './BlogPage/ArticlePage';

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
  const [archivedCandidates, setArchivedCandidates] = useState([]);

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
            element={<LandingPage isLoggedIn={isLoggedIn} />}
          />
          <Route path="/blog" element={<BlogListPage isLoggedIn={isLoggedIn} />} />
          <Route path="/blog/:slug" element={<ArticlePage isLoggedIn={isLoggedIn} />} />

        {/* Login Route */}
        <Route
          path="/login"
          element={<LoginGate isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
              path="/companies"
              element={<HomePage
                  setSelectedCandidate={setSelectedCandidate}
                  setIsLoggedIn={setIsLoggedIn}
              />}
           />
           <Route
              path="/match/:jobId"
              element={<HomePage
                  setSelectedCandidate={setSelectedCandidate}
                  setIsLoggedIn={setIsLoggedIn}
              />}
           />
           <Route
              path="/tracking/:jobId"
              element={<HomePage
                  setSelectedCandidate={setSelectedCandidate}
                  setIsLoggedIn={setIsLoggedIn}
                  archivedCandidates={archivedCandidates}
                  setArchivedCandidates={setArchivedCandidates}
              />}
           />
           <Route
              path="/tracking/:jobId/archive"
              element={<HomePage
                  setSelectedCandidate={setSelectedCandidate}
                  setIsLoggedIn={setIsLoggedIn}
                  archivedCandidates={archivedCandidates}
                  setArchivedCandidates={setArchivedCandidates}
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
