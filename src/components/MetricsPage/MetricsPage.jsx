import React, { useState, useEffect } from 'react';
import { Typography, Select, Card, Divider } from 'antd';
import MetricsTable from './MetricsTable';
import api from '../../api';
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

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
        // fetchSummary/fetchUsers intentionally omitted: they close over page/rowsPerPage,
        // so listing them here would re-fire this effect (and reset page) on every page change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage]);

    return (
        <div style={{ backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginTop: 24, paddingLeft: 32, paddingRight: 32, paddingBottom: 16, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Title level={3} style={{ margin: 0, color: '#1976d2', fontWeight: 'bold' }}>
                        {t("metrics.dashboardTitle", "API Usage & Costs")}
                    </Title>

                    <Select
                        value={period}
                        onChange={(value) => setPeriod(value)}
                        style={{ minWidth: 200 }}
                        options={[
                            { value: 'today', label: t("metrics.today", "Today") },
                            { value: '7d', label: t("metrics.last7Days", "Last 7 Days") },
                            { value: '30d', label: t("metrics.last30Days", "Last 30 Days") },
                        ]}
                    />
                </div>

                <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0 }}>
                    {/* LEFT SIDE: Users Table — takes 2/3 of the space */}
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <MetricsTable
                            users={usersData}
                            page={page}
                            setPage={setPage}
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            totalCount={totalCount}
                        />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        {summary && (
                            <Card
                                style={{ borderRadius: 8, flex: 1 }}
                                styles={{ body: { padding: 24, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' } }}
                            >
                                <Title level={4} style={{ marginBottom: 16, marginTop: 0 }}>
                                    {t("metrics.overallSummary", "Overall Summary")}
                                </Title>

                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ flex: 1, backgroundColor: '#fff3e0', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                                            Total Spent
                                        </Text>
                                        <Title level={3} style={{ margin: 0, color: '#d32f2f' }}>
                                            ${summary.Total?.spent.toFixed(4)}
                                        </Title>
                                    </div>
                                    <div style={{ flex: 1, backgroundColor: '#e3f2fd', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                                            Total Actions
                                        </Text>
                                        <Title level={3} style={{ margin: 0, color: '#1976d2' }}>
                                            {summary.Total?.actions}
                                        </Title>
                                    </div>
                                </div>

                                <Divider style={{ margin: '20px 0' }} />

                                <Text type="secondary" strong style={{ display: 'block', marginBottom: 8 }}>
                                    {t("metrics.costBreakdown", "COST BREAKDOWN")}
                                </Text>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                                    {['PARSE_CV', 'PARSE_RAW_CV', 'PARSE_JD', 'MATCH_CANDIDATES'].map((key) => {
                                        if (!summary[key]) return null;
                                        return (
                                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 6, padding: '12px 16px' }}>
                                                <Text style={{ fontWeight: 500 }}>
                                                    {key.replace(/_/g, ' ')}
                                                </Text>
                                                <div style={{ textAlign: 'right' }}>
                                                    <Text strong style={{ display: 'block' }}>
                                                        ${summary[key].spent.toFixed(4)}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {summary[key].actions} actions
                                                    </Text>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsPage;
