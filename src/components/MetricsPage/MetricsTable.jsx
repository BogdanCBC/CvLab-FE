import * as React from 'react';
import { Box, Table, TableHead, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper } from '@mui/material';
import { useTranslation } from "react-i18next";

export default function MetricsTable({
                                         users, page, setPage, rowsPerPage, setRowsPerPage, totalCount
                                     }) {
    const {t} = useTranslation();

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    return(
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <TableContainer component={Paper} sx={{ flex: 1, overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 2 }}>
                <Table stickyHeader sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: '#f4f6f8', fontWeight: 'bold', fontSize: '1rem', py: 2 }}>{t("metrics.username", "Username")}</TableCell>
                            <TableCell sx={{ backgroundColor: '#f4f6f8', fontWeight: 'bold', fontSize: '1rem', py: 2 }} align="right">{t("metrics.actionsCount", "AI Actions")}</TableCell>
                            <TableCell sx={{ backgroundColor: '#f4f6f8', fontWeight: 'bold', fontSize: '1rem', py: 2 }} align="right">{t("metrics.inTokens", "Input Tokens")}</TableCell>
                            <TableCell sx={{ backgroundColor: '#f4f6f8', fontWeight: 'bold', fontSize: '1rem', py: 2 }} align="right">{t("metrics.outTokens", "Output Tokens")}</TableCell>
                            <TableCell sx={{ backgroundColor: '#f4f6f8', fontWeight: 'bold', fontSize: '1rem', py: 2 }} align="right">{t("metrics.totalSpent", "Total Spent ($)")}</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users && users.map((user, index) => (
                            <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ py: 2, fontSize: '0.95rem' }}>{user.username}</TableCell>
                                <TableCell align="right" sx={{ py: 2, fontSize: '0.95rem' }}>{user.actions_count}</TableCell>
                                <TableCell align="right" sx={{ py: 2, fontSize: '0.95rem', color: 'text.secondary' }}>{user.in_tokens?.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ py: 2, fontSize: '0.95rem', color: 'text.secondary' }}>{user.out_tokens?.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ py: 2, fontWeight: 'bold', color: '#d32f2f', fontSize: '1.05rem' }}>
                                    ${user.spent.toFixed(4)}
                                </TableCell>
                            </TableRow>
                        ))}

                        {(!users || users.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary', fontSize: '1.1rem' }}>
                                    {t("metrics.noData", "No metrics data found for this period.")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
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