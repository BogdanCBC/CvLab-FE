// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './TopBar/TopBar';
import CandidatesList from './CandidatesList/CandidatesList';
import CandidateDetails from './CandidateDetails/CandidateDetails';
import Login from './Login/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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
                <TopBar />
                <CandidatesList
                  candidate={selectedCandidate}
                  selectedHandler={setSelectedCandidate}
                />
                <CandidateDetails
                  candidate={selectedCandidate}
                  selectedHandler={setSelectedCandidate}
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
