import React from 'react';
import { Table, Button, Input } from 'antd';
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, ArrowRightIcon } from '../../constants/icons';
import '../CandidatesList/CandidatesTable/CandidatesTable.css';

export default function UsersTable({
    users, onResetPassword, page, setPage,
    rowsPerPage, setRowsPerPage, searchTerm, setSearchTerm, totalCount
}) {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("adminPage.username"),
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: t("adminPage.role"),
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: t("adminPage.actions"),
            key: 'actions',
            render: (_, user) => (
                <Button
                    type="primary"
                    className="default-button small"
                    style={{ height: '30px'}}
                    onClick={(e) => {
                        e.stopPropagation();
                        onResetPassword(user);
                    }}
                >
                    {t("adminPage.resetPassword")}
                </Button>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        if (pagination.pageSize !== rowsPerPage) {
            setPage(0);
            setRowsPerPage(pagination.pageSize);
        } else {
            setPage(pagination.current - 1);
        }
    };

    return (
        <div>
            <Input
                placeholder={t("adminPage.searchUser")}
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                }}
                style={{ marginBottom: 16 }}
            />
            <Table
                className="candidates-table"
                dataSource={users}
                columns={columns}
                rowKey="user_id"
                onRow={(row) => ({
                    className: 'candidates-table-row',
                })}
                pagination={{
                    current: page + 1,
                    pageSize: rowsPerPage,
                    total: totalCount,
                    prevIcon: <span><ArrowLeftIcon /> Previous</span>,
                    nextIcon: <span>Next <ArrowRightIcon /></span>,
                }}
                onChange={handleTableChange}
            />
        </div>
    );
}
