import React from 'react';
import './CandidatesList.css';
import CandidatesTable from './CandidatesTable/CandidatesTable';

function CandidatesList(props) {

    return (
        <div className="candidates-list">
            <CandidatesTable candidate={props.selectedCandidate} selectedHandler={props.selectedHandler}/>
        </div>
    );
}

export default CandidatesList;
