import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CandidatesList.css';
import CandidatesTable from './CandidatesTable/CandidatesTable';
import { Button } from '@mui/material';
import RefreshButton from './RefreshButton/RefreshButton';
import { fetchCandidates } from '../../utils/fetchCandidates';
import AdvancedFilters from './AdvancedFilters/AdvancedFilters';

function CandidatesList(props) {
    const { candidateId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCandidates().then(sortedCandidates => {
            props.setCandidates(sortedCandidates);
        });
    }, []);

    useEffect(() => {
        if (candidateId) {
            const normalize = isNaN(Number(candidateId)) ? candidateId : Number(candidateId);
            console.log("Normalized", normalize);
            props.setSelectedCandidate(normalize);
        }
    }, [candidateId]);

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
                setSelectedCandidate={props.setSelectedCandidate}
                editMode={props.editMode}
                setEditMode={props.setEditMode}
            />
        </div>
    );
}

export default CandidatesList;
