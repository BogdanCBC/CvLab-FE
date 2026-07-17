import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Space, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import UsersTable from './UsersTable';
import CreateUserModal from './CreateUserModal';
import ResetPasswordModal from "./ResetPasswordModal";
import api from '../../api';
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const AdminPage = ({ setIsLoggedIn }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await api.get('/user', {
                params: {
                    skip: page * rowsPerPage,
                    limit: rowsPerPage,
                    search_term: searchTerm
                }
            });
            setUsers(response.data.items);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, [page, rowsPerPage, searchTerm]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchUsers]);

    const openResetDialog = (user) => {
        setSelectedUser(user);
        setIsResetModalOpen(true);
    };

    return (
        <div>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 0' }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ margin: 0, color: '#1976d2' }}>
                        {t("adminPage.userManagement")}
                    </Title>
                    <Space>
                        <Button className="filled-btn" onClick={() => navigate('/admin/prompts')}>
                            {t("adminPage.promptEngineering", "Prompt Engineering")}
                        </Button>
                        <Button className="filled-btn" onClick={() => navigate('/metrics')}>
                            {t("adminPage.viewMetrics", "View Metrics")}
                        </Button>
                        <Button type="primary" className="default-button small" onClick={() => setIsCreateModalOpen(true)}>
                            {t("adminPage.createNewUser")}
                        </Button>
                    </Space>
                </Flex>

                <UsersTable
                    users={users}
                    onResetPassword={openResetDialog}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalCount={totalCount}
                />
            </div>

            <CreateUserModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onUserCreated={fetchUsers}
            />

            <ResetPasswordModal
                open={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                targetUser={selectedUser}
            />
        </div>
    );
};

export default AdminPage;
