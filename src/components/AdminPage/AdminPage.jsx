import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UsersTable from './UsersTable';
import CreateUserModal from './CreateUserModal';
import ResetPasswordModal from "./ResetPasswordModal";

import api from '../../api';
import GenericHeader from "../GenericHeader/GenericHeader";

import {useTranslation} from "react-i18next";

const AdminPage = ({ setIsLoggedIn }) => {
    const {t} = useTranslation();

    const [users, setUsers] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalCount, setTotalCount] = useState(0);

    const fetchUsers = async () => {
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
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, rowsPerPage, searchTerm]);

    const openResetDialog = (user) => {
        setSelectedUser(user);
        setIsResetModalOpen(true);
    };

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <GenericHeader setIsLoggedIn={setIsLoggedIn} navigateLocation='/candidates'/>

            <Container maxWidth="lg" sx={{ mt: 6 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {t("adminPage.userManagement")}
                    </Typography>

                    <Button variant="contained" color="success" onClick={() => setIsCreateModalOpen(true)}>
                        {t("adminPage.createNewUser")}
                    </Button>
                </Box>

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
            </Container>

            {/* Modal for Creating User */}
            <CreateUserModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onUserCreated={fetchUsers}
            />

            {/* Modal for Resetting Password */}
            <ResetPasswordModal
                open={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                targetUser={selectedUser}
            />
        </Box>
    );
};

export default AdminPage;