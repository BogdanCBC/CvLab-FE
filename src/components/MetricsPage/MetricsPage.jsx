import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Card, CardContent, Divider } from '@mui/material';
import GenericHeader from '../GenericHeader/GenericHeader';
import MetricsTable from './MetricsTable';
import api from '../../api';
import { useTranslation } from "react-i18next";

const MetricsPage = ({ setIsLoggedIn }) => {
    const { t } = useTranslation();

    const [period, setPeriod] = useState('30d');
    const [summary, setSummary] = useState(null);
    const [usersData, setUsersData] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const fetchSummary = async () => {
        try {
            const response = await api.get('/metrics/summary', { params: { period } });
            setSummary(response.data);
        } catch (error) {
            console.error("Error fetching summary metrics:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/metrics/users', {
                params: {
                    period,
                    skip: page * rowsPerPage,
                    limit: rowsPerPage
                }
            });
            setUsersData(response.data.items);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error("Error fetching users metrics:", error);
        }
    };

    useEffect(() => {
        setPage(0);
        fetchSummary();
        fetchUsers();
    }, [period]);

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage]);

    return (
        <Box sx={{ backgroundColor: '#f9f9f9', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <GenericHeader setIsLoggedIn={setIsLoggedIn} navigateLocation='/admin' />

            <Box sx={{ mt: 3, px: 4, pb: 2, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {t("metrics.dashboardTitle", "API Usage & Costs")}
                    </Typography>

                    <FormControl size="small" sx={{ minWidth: 200, backgroundColor: 'white', borderRadius: 1 }}>
                        <Select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            variant="outlined"
                        >
                            <MenuItem value="today">{t("metrics.today", "Today")}</MenuItem>
                            <MenuItem value="7d">{t("metrics.last7Days", "Last 7 Days")}</MenuItem>
                            <MenuItem value="30d">{t("metrics.last30Days", "Last 30 Days")}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', gap: 2, minHeight: 0 }}>
                    {/* LEFT SIDE: Users Table — takes 2/3 of the space */}
                    <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <MetricsTable
                            users={usersData}
                            page={page}
                            setPage={setPage}
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            totalCount={totalCount}
                        />
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        {summary && (
                            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 2, flex: 1 }}>
                                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                                    <Typography variant="h5" fontWeight="bold" mb={2}>
                                        {t("metrics.overallSummary", "Overall Summary")}
                                    </Typography>

                                    {/* Two stat boxes side by side */}
                                    <Box display="flex" gap={2}>
                                        <Box sx={{ flex: 1, backgroundColor: '#fff3e0', borderRadius: 2, p: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Total Spent
                                            </Typography>
                                            <Typography variant="h4" color="error.main" fontWeight="bold">
                                                ${summary.Total?.spent.toFixed(4)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1, backgroundColor: '#e3f2fd', borderRadius: 2, p: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Total Actions
                                            </Typography>
                                            <Typography variant="h4" color="primary.main" fontWeight="bold">
                                                {summary.Total?.actions}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2.5 }} />

                                    {/* Breakdown by Category */}
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" gutterBottom>
                                        {t("metrics.costBreakdown", "COST BREAKDOWN")}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                                        {['PARSE_CV', 'PARSE_RAW_CV', 'PARSE_JD', 'MATCH_CANDIDATES'].map((key) => {
                                            if (!summary[key]) return null;
                                            return (
                                                <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 1.5, px: 2, py: 1.5 }}>
                                                    <Typography variant="body2" fontWeight="500">
                                                        {key.replace(/_/g, ' ')}
                                                    </Typography>
                                                    <Box textAlign="right">
                                                        <Typography variant="body2" fontWeight="bold">
                                                            ${summary[key].spent.toFixed(4)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {summary[key].actions} actions
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MetricsPage;