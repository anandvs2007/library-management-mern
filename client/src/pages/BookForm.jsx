import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Typography, TextField, Button, Stack, Alert, CircularProgress } from '@mui/material';
import { getBook, createBook, updateBook, errorMessage } from '../services/bookService';

const empty = { title: '', author: '', isbn: '', genre: '', copiesAvailable: 1, shelfLocation: '' };

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) { setForm(empty); setLoading(false); return; }
    setLoading(true);
    getBook(id)
      .then((data) => setForm(data))
      .catch((err) => setServerError(errorMessage(err, 'Could not load this book')))
      .finally(() => setLoading(false));
  }, [id]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Enter the book title';
    if (!form.author.trim()) e.author = 'Enter the author';
    if (!form.isbn.trim()) e.isbn = 'Enter the ISBN';
    const copies = Number(form.copiesAvailable);
    if (form.copiesAvailable === '' || !Number.isInteger(copies) || copies < 0) {
      e.copiesAvailable = 'Enter a whole number, 0 or more';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSaving(true);
    const payload = {
      title: form.title, author: form.author, isbn: form.isbn, genre: form.genre,
      copiesAvailable: Number(form.copiesAvailable), shelfLocation: form.shelfLocation,
    };
    try {
      if (id) await updateBook(id, payload);
      else await createBook(payload);
      navigate('/');
    } catch (err) {
      setServerError(errorMessage(err, 'Could not save the book'));
      setSaving(false);
    }
  };

  if (loading) return <Stack alignItems="center" py={8}><CircularProgress aria-label="Loading book" /></Stack>;

  return (
    <Paper variant="outlined" sx={{ p: 3, maxWidth: 560, mx: 'auto' }}>
      <Typography variant="h5" component="h1" mb={2}>{id ? 'Edit book' : 'Add a book'}</Typography>
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
      <form onSubmit={save} noValidate>
        <Stack spacing={2}>
          <TextField label="Title" name="title" value={form.title} onChange={change} required error={!!errors.title} helperText={errors.title} />
          <TextField label="Author" name="author" value={form.author} onChange={change} required error={!!errors.author} helperText={errors.author} />
          <TextField label="ISBN" name="isbn" value={form.isbn} onChange={change} required error={!!errors.isbn} helperText={errors.isbn} />
          <TextField label="Genre" name="genre" value={form.genre || ''} onChange={change} />
          <TextField
            label="Copies available" name="copiesAvailable" type="number" inputProps={{ min: 0 }}
            value={form.copiesAvailable} onChange={change} required
            error={!!errors.copiesAvailable} helperText={errors.copiesAvailable}
          />
          <TextField label="Shelf location" name="shelfLocation" value={form.shelfLocation || ''} onChange={change} />
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving…' : id ? 'Save changes' : 'Add book'}
            </Button>
            <Button variant="text" onClick={() => navigate('/')} disabled={saving}>Cancel</Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}
