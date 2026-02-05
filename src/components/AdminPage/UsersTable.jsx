import * as React from 'react';
import { Box, Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, Button, TextField } from '@mui/material';
import Fuse from 'fuse.js';

export default function UsersTable({ users, onResetPassword }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchTerm, setSearchTerm] = React.useState('');

    const fuse = new Fuse(users, {
        keys: ['username', 'role'],
        threshold: 0.3,
    });

    const filteredUsers = searchTerm
        ? fuse.search(searchTerm).map(result => result.item)
        : users;

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <TextField
                label="Search Users"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                }}
            />

            <TableContainer component={Paper} sx={{ maxHeight: 550, overflowY: 'auto' }}>
                <Table stickyHeader sx={{ minWidth: 500 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Username</TableCell>
                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredUsers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => (
                                <TableRow key={user.user_id} hover>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onResetPassword(user);
                                            }}
                                            variant="contained"
                                            size="small"
                                            sx={{ backgroundColor: '#1976d2', color: 'white' }}
                                        >
                                            RESET PASSWORD
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={filteredUsers.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
}