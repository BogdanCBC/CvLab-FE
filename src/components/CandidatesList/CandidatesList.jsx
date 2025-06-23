import React, { useState, useEffect } from 'react';
import './CandidatesList.css';
import CandidatesTable from './CandidatesTable/CandidatesTable';
import { Button } from '@mui/material';
import RefreshButton from './RefreshButton/RefreshButton';
import api from '../../api';
import AdvancedFilters from './AdvancedFilters/AdvancedFilters';

function CandidatesList(props) {

    useEffect(() => {fetchData()}, []);
    const [data, setData] = useState([]);
    const [modalState, setModalState] = useState(false);
    
    const fetchData = async () => {
        const response = await api.get("/candidates");
        const data = response.data.map(candidate => ({
            id: candidate.id,
            firstName: candidate.first_name,
            lastName: candidate.last_name,
            experience: candidate.experience,
            position: candidate.position,
        }));
        console.log(data);
        const sorted = data.sort((a, b) => b.id - a.id);
        setData(sorted);
    }

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
                    fetchDataFunction={fetchData}
                />
            </div>

            <AdvancedFilters
                setData={setData}
                modalState={modalState}
                setModalState={setModalState}
            />

            <CandidatesTable 
                data={data}
                candidate={props.selectedCandidate}
                selectedHandler={props.selectedHandler}
                editMode={props.editMode}
                setEditMode={props.setEditMode}
            />
        </div>
    );
}

export default CandidatesList;
