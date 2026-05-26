import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CandidatesList.scss';
import CandidatesTable from './CandidatesTable/CandidatesTable';
import AdvancedFilters from './AdvancedFilters/AdvancedFilters';
import { Input, Button, Tooltip } from 'antd';
import { SlidersOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import api from '../../api';
import { SearchIcon , FilterIcon } from '../../constants/icons';

function CandidatesList(props) {
    const { t, i18n } = useTranslation();
    const { candidateId } = useParams();

    const [modalState, setModalState] = useState(false);

    // Pagination States managed centrally!
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(9);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalCount, setTotalCount] = useState(-1);
    const [activeFilters, setActiveFilters] = useState(null);

    const fetchCandidatesData = async () => {
        const skip = page * rowsPerPage;
        const limit = rowsPerPage;
        const currentLang = i18n.language?.startsWith('fr') ? 'French' : 'English';

        try {
            let response;
            if (activeFilters) {
                response = await api.post(`/filters?language=${currentLang}`, {
                    ...activeFilters, skip, limit, search_term: searchTerm
                });
            } else {
                response = await api.get('/candidates', {
                    params: { skip, limit, language: currentLang, search_term: searchTerm }
                });
            }

            const data = response.data.items || response.data || [];
            const total = response.data.total !== undefined ? response.data.total : -1;

            const mappedData = data.map(candidate => ({
                id: candidate.id,
                firstName: candidate.first_name || candidate.firstName,
                lastName: candidate.last_name || candidate.lastName,
                experience: candidate.experience,
                position: candidate.position,
                language: candidate.language,
            }));

            props.setCandidates(mappedData);
            setTotalCount(total !== -1 ? total : mappedData.length);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        }
    };

    // Trigger fetch on dependencies changing
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCandidatesData();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [page, rowsPerPage, searchTerm, activeFilters, i18n.language]);

    // FIX: Listen for the Modal's Upload Event!
    useEffect(() => {
        const handleRefresh = () => fetchCandidatesData();
        window.addEventListener('refreshCandidates', handleRefresh);
        return () => window.removeEventListener('refreshCandidates', handleRefresh);
    }, [page, rowsPerPage, searchTerm, activeFilters, i18n.language]);

    useEffect(() => {
        if (candidateId) {
            const normalize = isNaN(Number(candidateId)) ? candidateId : Number(candidateId);
            props.setSelectedCandidate(normalize);
        }
    }, [candidateId]);

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        setPage(0);
        setModalState(false);
    };

    const handleRefresh = () => {
        setActiveFilters(null);
        setSearchTerm('');
        setPage(0);

        if (!activeFilters && searchTerm === '' && page === 0) {
            fetchCandidatesData();
        }
    };

    return (
        <div className="candidates-list">
            <div className="candidates-list-header">
                <Input
                    placeholder={t('candidateTable.searchCandidates')}
                    prefix={<SearchIcon />}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(0);
                    }}
                    className="candidates-search"
                />
                <Button
                    icon={<FilterIcon />}
                    onClick={() => setModalState(true)}
                    className="filters-button"
                >
                    {t('candidatesList.Filters', 'Filters')}
                </Button>
                <Tooltip title={t('candidateTable.refreshTooltip')}>
                    <Button onClick={handleRefresh} className="icon-button refresh-button" icon={<SyncOutlined />}></Button>
                </Tooltip>
            </div>

            <CandidatesTable
                candidates={props.candidates}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                totalCount={totalCount}
                selectedCandidate={props.selectedCandidate}
                setSelectedCandidate={props.setSelectedCandidate}
                setEditMode={props.setEditMode}
            />

            <AdvancedFilters
                modalState={modalState}
                setModalState={setModalState}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
}

export default CandidatesList;