import React, { useState } from 'react';
import TopBar from './TopBar/TopBar';
import CandidatesList from './CandidatesList/CandidatesList';
import CandidateDetails from './CandidateDetails/CandidateDetails';
import './App.css';

function App() {
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    return (
        <div className='app'>
            <TopBar />
            <CandidatesList candidate={selectedCandidate} selectedHandler={setSelectedCandidate}/>
            <CandidateDetails candidate={selectedCandidate} selectedHandler={setSelectedCandidate}/>
        </div>
    )
}

export default App;