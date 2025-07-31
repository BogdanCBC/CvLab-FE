import React, { useState } from "react";
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { 
    TableContainer, 
    Table,
    TableHead,
    TableRow,
    TableCell,
    Paper,
    TableBody,
    TableFooter,
    TablePagination,
    Box, 
    IconButton
 } from "@mui/material";

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';


// Table actions
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


export default function JDTable({jobs, setSelectedJob}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const emptyRows = 
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsPerPage.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    const truncate = (text, limit) => text.length > limit ? text.slice(0, limit) + '...' : text;  

    const handleSelect = (event, jobId) => {
        console.log("Selected job ID:", jobId);
    };

    return(
        <div className="jd-table">
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Short Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                          ? jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          : jobs
                        ).map((job) => (
                            <TableRow
                                key={job.job_id}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} 
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={(e) => handleSelect(e, job.job_id)}
                            >
                                <TableCell>{job.title}</TableCell>
                                <TableCell>{truncate(job.description, 40)}</TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10 , 25, { label: 'All', value: -1 }]}
                                colSpan={4}
                                count={jobs.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    );
}