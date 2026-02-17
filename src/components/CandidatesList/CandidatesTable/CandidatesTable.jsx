import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Button, TextField } from '@mui/material';
import './CandidatesTable.css'
import Fuse from 'fuse.js';
import {useTranslation} from "react-i18next";


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


export default function CandidatesTable(props) {
  const { t } = useTranslation();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fuse = new Fuse(props.candidates, {
    keys: ['firstName', 'lastName', 'experience', 'position', 'language'],
    threshold: 0.3,
  });

  const filteredCandidates = searchTerm
      ? fuse.search(searchTerm).map(result => result.item)
      : props.candidates;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.candidates.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <TextField
        label={ t("candidateTable.searchCandidates") }
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
        <Table
          stickyHeader
          sx={{ minWidth: 500 }}
          aria-label="custom pagination table"
        >
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell style={{ width: '25%' }}>{ t("candidateTable.firstName") }</TableCell>
              <TableCell align="right">{ t("candidateTable.lastName") }</TableCell>
              <TableCell align="right">{ t("candidateTable.experience") }</TableCell>
              <TableCell align="right">{ t("candidateTable.role") }</TableCell>
              <TableCell align="right">{ t("candidateTable.actions") }</TableCell>
            </TableRow>
          </TableHead>

            <TableBody>
                {(rowsPerPage > 0
                        ? filteredCandidates.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                        )
                        : filteredCandidates
                ).map((row) => (
                    <TableRow
                        key={row.id}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = '#f0f0f0')
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = 'transparent')
                        }
                        onClick={() => {
                            props.setSelectedCandidate(row.id);
                        }}
                    >
                        <TableCell sx={{ width: '15%' }}>{row.firstName}</TableCell>

                        <TableCell sx={{ width: '15%' }} align="right">
                            {row.lastName}
                        </TableCell>

                        <TableCell sx={{ width: '10%' }} align="right">
                            {row.experience}
                        </TableCell>

                        <TableCell sx={{ width: '45%' }} align="right">
                            {row.position}
                        </TableCell>

                        <TableCell sx={{ width: '15%' }} align="right">
                            <Button
                                onClick={() => {
                                    props.setSelectedCandidate(row.id);
                                    props.setEditMode(false);
                                }}
                                variant="contained"
                                sx={{
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    width: '40px',
                                    height: '30px',
                                }}
                            >
                                { t("candidateTable.details") }
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}

                {emptyRows > 0 && (
                    <TableRow>
                        <TableCell colSpan={5} />
                    </TableRow>
                )}
            </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                // Make the pagination row stick to the bottom of the scroll area
                sx={{
                  position: 'sticky',
                  bottom: 0,
                  zIndex: 2,
                  backgroundColor: (theme) => theme.palette.background.paper,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  left: 0,
                  right: 0,
                }}
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={6} // match the number of columns
                count={filteredCandidates.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: { 'aria-label': 'Candidates per page' },
                    native: true,
                  },
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
