import React from 'react';
import { Table, Typography } from 'antd';
import './MetricsTable.css';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ArrowRightIcon } from '../../constants/icons';

const { Text } = Typography;

export default function MetricsTable({
                                         users, page, setPage, rowsPerPage, setRowsPerPage, totalCount
                                     }) {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("metrics.username", "Username"),
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: t("metrics.actionsCount", "AI Actions"),
            dataIndex: 'actions_count',
            key: 'actions_count',
            align: 'right',
        },
        {
            title: t("metrics.inTokens", "Input Tokens"),
            dataIndex: 'in_tokens',
            key: 'in_tokens',
            align: 'right',
            render: (value) => value?.toLocaleString(),
        },
        {
            title: t("metrics.outTokens", "Output Tokens"),
            dataIndex: 'out_tokens',
            key: 'out_tokens',
            align: 'right',
            render: (value) => value?.toLocaleString(),
        },
        {
            title: t("metrics.totalSpent", "Total Spent ($)"),
            dataIndex: 'spent',
            key: 'spent',
            align: 'right',
            render: (value) => (
                <Text strong style={{ color: '#d32f2f' }}>
                    ${value.toFixed(4)}
                </Text>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        if (pagination.pageSize !== rowsPerPage) {
            setRowsPerPage(pagination.pageSize);
            setPage(0);
        } else {
            setPage(pagination.current - 1);
        }
    };

    return (
        <Table
            className="metrics-table"
            columns={columns}
            dataSource={users}
            rowKey={(record, index) => index}
            pagination={{
                current: page + 1,
                pageSize: rowsPerPage,
                total: totalCount,
                showSizeChanger: false,
                prevIcon: <span><ArrowLeftIcon /> Previous</span>,
                nextIcon: <span>Next <ArrowRightIcon /></span>,
            }}
            onChange={handleTableChange}
            locale={{
                emptyText: t("metrics.noData", "No metrics data found for this period."),
            }}
        />
    );
}
