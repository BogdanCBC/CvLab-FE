import React from 'react';
import { Table, Tag, Button } from 'antd';
import './CandidatesTable.css';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ArrowRightIcon } from '../../../constants/icons';

const ROLE_DOT_COLOR = {
    'Product Manager': '#F04438',
};
const DEFAULT_DOT_COLOR = '#17B26A';

function RoleTag({ position }) {
    const color = ROLE_DOT_COLOR[position] ?? DEFAULT_DOT_COLOR;
    return (
        <Tag className="role-tag">
            <span className="role-dot" style={{ backgroundColor: color }} />
            {position}
        </Tag>
    );
}

export default function CandidatesTable({
    candidates,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalCount,
    selectedCandidate,
    setSelectedCandidate,
    setEditMode,
}) {
    const { t } = useTranslation();

    const columns = [
        {
            title: t('candidateTable.firstName'),
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: t('candidateTable.lastName'),
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: t('candidateTable.experience'),
            dataIndex: 'experience',
            key: 'experience',
        },
        {
            title: t('candidateTable.role'),
            dataIndex: 'position',
            key: 'position',
            render: (position) => <RoleTag position={position} />,
        },
        {
            title: t('candidateTable.actions'),
            key: 'actions',
            render: (_, row) => (
                <Button
                    type="link"
                    className="view-link"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCandidate(row.id);
                        setEditMode(false);
                    }}
                >
                    {t('candidateTable.details', 'View')}
                </Button>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        setPage(pagination.current - 1);
        // setRowsPerPage(pagination.pageSize);
    };

    return (
        <Table
            className="candidates-table"
            dataSource={candidates}
            columns={columns}
            rowKey="id"
            onRow={(row) => ({
                onClick: () => setSelectedCandidate(row.id),
                className: `candidates-table-row${selectedCandidate === row.id ? ' active' : ''}`,
            })}
            pagination={{
                current: page + 1,
                pageSize: 9,
                total: totalCount,
                showSizeChanger: false,
                prevIcon: <span><ArrowLeftIcon /> Previous</span>,
                nextIcon: <span>Next <ArrowRightIcon /></span>,
            }}
            onChange={handleTableChange}
        />
    );
}
