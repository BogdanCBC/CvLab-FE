// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './TopBar/TopBar';
import CandidatesList from './CandidatesList/CandidatesList';
import CandidateDetails from './CandidateDetails/CandidateDetails';
import Login from './Login/Login';
import { isTokenValid } from '../utils/auth'
import './App.css';

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
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
          }
        />

        {/* Main App Route */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <div className="app">
                <TopBar 
                  candidates={candidates}
                  setCandidates={setCandidates}
                />
                <CandidatesList
                  selectedHandler={setSelectedCandidate}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  advancedSearch={advancedSearch}
                  setAdvancedSearch={setAdvancedSearch}
                  candidates={candidates}
                  setCandidates={setCandidates}
                />
                <CandidateDetails
                  selectedCandidate={selectedCandidate}
                  selectedHandler={setSelectedCandidate}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  setCandidates={setCandidates}
                />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
