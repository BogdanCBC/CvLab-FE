import React, { useState, useEffect } from 'react';
import './CandidatesList.css';
import CandidatesTable from './CandidatesTable/CandidatesTable';
import { Button } from '@mui/material';
import RefreshButton from './RefreshButton/RefreshButton';
import { fetchCandidates } from '../../utils/fetchCandidates';
import AdvancedFilters from './AdvancedFilters/AdvancedFilters';

function CandidatesList(props) {

    useEffect(() => {
        fetchCandidates().then(sortedCandidates => {
            props.setCandidates(sortedCandidates);
        });
    }, []);

    const [modalState, setModalState] = useState(false);

    return (
        <div className="candidates-list">
            <div className='table-buttons'>
                <Button 
                    variant='contained'
                    sx={{height: 40}}
                    onClick={() => setModalState(true)}
                > 
                    Open advanced filters
                </Button>
                <RefreshButton
                    setCandidates={props.setCandidates}
                />
            </div>

            <AdvancedFilters
                setCandidates={props.setCandidates}
                modalState={modalState}
                setModalState={setModalState}
            />

            <CandidatesTable 
                candidates={props.candidates}
                candidate={props.selectedCandidate}
                selectedHandler={props.selectedHandler}
                editMode={props.editMode}
                setEditMode={props.setEditMode}
            />
        </div>
    );
}

export default CandidatesList;
