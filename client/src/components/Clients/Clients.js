import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './Clients.module.css';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Container,
  Button,
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  DeleteOutlineRounded as DeleteIcon,
  BorderColor as EditIcon,
} from '@mui/icons-material';
import { deleteClient } from '../../actions/clientActions';

function TablePaginationActions(props) {
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
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Clients = ({ setOpen, setCurrentId, clients }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(clients.length);
  const dispatch = useDispatch();

  const rows = clients;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows?.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (selectedInvoice) => {
    setOpen((prevState) => !prevState);
    setCurrentId(selectedInvoice);
  };

  const tableStyle = {
    width: 160,
    fontSize: 14,
    cursor: 'pointer',
    borderBottom: 'none',
    padding: '8px',
    textAlign: 'center',
  };
  const headerStyle = { borderBottom: 'none', textAlign: 'center' };

  return (
    <div className={styles.pageLayout}>
      <Container sx={{ width: '85%' }}>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerStyle, width: '10px' }}>Number</TableCell>
                <TableCell sx={headerStyle}>Name</TableCell>
                <TableCell sx={headerStyle}>Email</TableCell>
                <TableCell sx={headerStyle}>Phone</TableCell>
                <TableCell sx={headerStyle}>Edit</TableCell>
                <TableCell sx={headerStyle}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
              ).map((row, index) => (
                <TableRow key={row._id} sx={{ cursor: 'pointer' }}>
                  <TableCell sx={{ ...tableStyle, width: '10px' }}>{index + 1}</TableCell>
                  <TableCell sx={tableStyle} scope="row">
                    <Button sx={{ textTransform: 'none' }}>{row.name}</Button>
                  </TableCell>
                  <TableCell sx={tableStyle}>{row.email}</TableCell>
                  <TableCell sx={tableStyle}>{row.phone}</TableCell>
                  <TableCell sx={{ ...tableStyle, width: '10px' }}>
                    <IconButton onClick={() => handleEdit(row._id)}>
                      <EditIcon sx={{ width: '20px', height: '20px' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ ...tableStyle, width: '10px' }}>
                    <IconButton onClick={() => dispatch(deleteClient(row._id))}>
                      <DeleteIcon sx={{ width: '20px', height: '20px' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={6}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default Clients;
