import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UsersTable from './UsersTable';
import CreateUserModal from './CreateUserModal';
import ResetPasswordModal from "./ResetPasswordModal";

import api from '../../api';
import GenericHeader from "../GenericHeader/GenericHeader";

const AdminPage = ({ setIsLoggedIn }) => {
    const [users, setUsers] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const navigate = useNavigate();
    const logo = require('../../images/logov2.png');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/user');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/login');
    };

    const openResetDialog = (user) => {
        setSelectedUser(user);
        setIsResetModalOpen(true);
    };

    return (
        <Box sx={{ flexGrow: 1, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <GenericHeader setIsLoggedIn={setIsLoggedIn} navigateLocation='/candidates'/>

            <Container maxWidth="lg" sx={{ mt: 6 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>User Management</Typography>

                    <Button variant="contained" color="success" onClick={() => setIsCreateModalOpen(true)}>
                        Create New User
                    </Button>
                </Box>

                <UsersTable
                    users={users}
                    onResetPassword={openResetDialog}
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