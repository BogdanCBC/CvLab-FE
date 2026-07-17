import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './CandidatesList.scss';
import CandidatesTable from './CandidatesTable/CandidatesTable';
import AdvancedFilters from './AdvancedFilters/AdvancedFilters';
import { Input, Button, Badge, notification } from 'antd';
import { useTranslation } from "react-i18next";
import api from '../../api';
import { SearchIcon , FilterIcon, CloseIcon } from '../../constants/icons';


function CandidatesList({ candidates, setCandidates, selectedCandidate, setSelectedCandidate, setEditMode }) {
    const { t, i18n } = useTranslation();
    const { candidateId } = useParams();

    const [modalState, setModalState] = useState(false);

    // Pagination States managed centrally!
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(9);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalCount, setTotalCount] = useState(-1);
    const [activeFilters, setActiveFilters] = useState(null);

    const fetchCandidatesData = useCallback(async () => {
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

            setCandidates(mappedData);
            setTotalCount(total !== -1 ? total : mappedData.length);
        } catch (error) {
            if (error?.response?.status === 404) {
                setCandidates([]);
                setTotalCount(0);
                notification.info({ message: t('advancedFilters.noCandidates') });
            } else {
                console.error("Error fetching candidates:", error);
            }
        }
    }, [page, rowsPerPage, searchTerm, activeFilters, i18n.language, t, setCandidates]);

    // Trigger fetch on dependencies changing
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCandidatesData();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchCandidatesData]);

    // FIX: Listen for the Modal's Upload Event!
    useEffect(() => {
        const handleRefresh = () => fetchCandidatesData();
        window.addEventListener('refreshCandidates', handleRefresh);
        return () => window.removeEventListener('refreshCandidates', handleRefresh);
    }, [fetchCandidatesData]);

    useEffect(() => {
        if (candidateId) {
            const normalize = isNaN(Number(candidateId)) ? candidateId : Number(candidateId);
            setSelectedCandidate(normalize);
        }
    }, [candidateId, setSelectedCandidate]);

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        setPage(0);
        setModalState(false);
    };

    const filterCount = activeFilters
        ? (activeFilters.position ? 1 : 0) +
          (activeFilters.experience !== undefined ? 1 : 0) +
          (activeFilters.skills?.length || 0) +
          (activeFilters.languages?.length || 0) +
          (activeFilters.certifications?.length || 0)
        : 0;

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
                <Badge count={filterCount} size="small">
                    <Button
                        icon={<FilterIcon />}
                        onClick={() => setModalState(true)}
                        className="filters-button"
                    >
                        {t('candidatesList.Filters', 'Filters')}
                    </Button>
                </Badge>
                {filterCount > 0 && (
                    <Button
                        icon={<CloseIcon />}
                        onClick={handleRefresh}
                        className="filters-button"
                    >
                        {t('candidateTable.clearFiltersTooltip', 'Clear all')}
                    </Button>
                )}
            </div>

            <CandidatesTable
                candidates={candidates}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                totalCount={totalCount}
                selectedCandidate={selectedCandidate}
                setSelectedCandidate={setSelectedCandidate}
                setEditMode={setEditMode}
            />

            <AdvancedFilters
                modalState={modalState}
                setModalState={setModalState}
                onApplyFilters={handleApplyFilters}
                activeFilters={activeFilters}
            />
        </div>
    );
}

export default CandidatesList;