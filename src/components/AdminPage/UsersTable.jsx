import * as React from 'react';
import { Box, Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, Button, TextField } from '@mui/material';
import { useTranslation } from "react-i18next";

export default function UsersTable({
                                       users, onResetPassword, page, setPage,
                                       rowsPerPage, setRowsPerPage, searchTerm, setSearchTerm, totalCount
                                   }) {
    const { t } = useTranslation();

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <TextField
                label={t("adminPage.searchUser")}
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0); // Reset to page 1 when searching
                }}
            />

            <TableContainer component={Paper} sx={{ maxHeight: 550, overflowY: 'auto' }}>
                <Table stickyHeader sx={{ minWidth: 500 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>{t("adminPage.username")}</TableCell>
                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>{t("adminPage.role")}</TableCell>
                            <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }} align="right">{t("adminPage.actions")}</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((user) => (
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
                                        {t("adminPage.resetPassword")}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                count={totalCount}
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