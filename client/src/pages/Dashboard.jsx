import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TablePagination, Paper,
  Typography, Button, IconButton, Chip, Stack, Snackbar, Alert, Tooltip, CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getBooks, deleteBook, issueBook, returnBook, errorMessage } from '../services/bookService';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0); // MUI pages start at 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await getBooks(page + 1, rowsPerPage);
      setBooks(data.books);
      setTotal(data.total);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [page, rowsPerPage]);

  useEffect(() => { load(); }, [load]);

  const replace = (updated) => setBooks((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));

  const handleStock = async (request, book, okMsg) => {
    try {
      replace(await request(book._id));
      setToast({ type: 'success', msg: okMsg });
    } catch (err) {
      setToast({ type: 'error', msg: errorMessage(err, 'Could not update the book') });
    }
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete “${book.title}”?`)) return;
    try {
      await deleteBook(book._id);
      setToast({ type: 'success', msg: 'Book deleted' });
      if (books.length === 1 && page > 0) setPage(page - 1);
      else load();
    } catch (err) {
      setToast({ type: 'error', msg: errorMessage(err, 'Could not delete the book') });
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={2}>
        <Typography variant="h4" component="h1">Books on the shelves</Typography>
        {status === 'success' && <Typography color="text.secondary">{total} titles</Typography>}
      </Stack>

      {status === 'loading' && (
        <Stack alignItems="center" py={8}><CircularProgress aria-label="Loading books" /></Stack>
      )}

      {status === 'error' && (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={load}>Retry</Button>}>
          We couldn’t load the books. Check your connection and try again.
        </Alert>
      )}

      {status === 'success' && (
        <Paper variant="outlined">
          <TableContainer>
            <Table aria-label="Books">
              <TableHead>
                <TableRow>
                  {['Title', 'Author', 'ISBN', 'Genre', 'Copies', 'Shelf', 'Actions'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((b) => (
                  <TableRow key={b._id} hover>
                    <TableCell>{b.title}</TableCell>
                    <TableCell>{b.author}</TableCell>
                    <TableCell>{b.isbn}</TableCell>
                    <TableCell>{b.genre}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={b.copiesAvailable}
                        color={b.copiesAvailable === 0 ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell>{b.shelfLocation}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                          size="small" variant="contained" disabled={b.copiesAvailable === 0}
                          onClick={() => handleStock(issueBook, b, `Issued “${b.title}”`)}
                        >
                          Issue
                        </Button>
                        <Button
                          size="small" variant="outlined"
                          onClick={() => handleStock(returnBook, b, `Returned “${b.title}”`)}
                        >
                          Return
                        </Button>
                        <Tooltip title="Edit">
                          <IconButton size="small" aria-label={`Edit ${b.title}`} onClick={() => navigate(`/edit/${b._id}`)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" aria-label={`Delete ${b.title}`} onClick={() => handleDelete(b)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {books.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography gutterBottom>No books yet.</Typography>
                      <Button variant="contained" onClick={() => navigate('/add')}>Add your first book</Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      )}

      <Snackbar open={!!toast} autoHideDuration={3500} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.type} onClose={() => setToast(null)}>{toast.msg}</Alert> : undefined}
      </Snackbar>
    </>
  );
}
