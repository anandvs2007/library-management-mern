import api from './api';

export const getBooks = (page = 1, limit = 10) =>
  api.get('/books', { params: { page, limit } }).then((r) => r.data);
export const getBook = (id) => api.get(`/books/${id}`).then((r) => r.data);
export const createBook = (book) => api.post('/books', book).then((r) => r.data);
export const updateBook = (id, book) => api.put(`/books/${id}`, book).then((r) => r.data);
export const deleteBook = (id) => api.delete(`/books/${id}`).then((r) => r.data);
export const issueBook = (id) => api.patch(`/books/${id}/issue`).then((r) => r.data);
export const returnBook = (id) => api.patch(`/books/${id}/return`).then((r) => r.data);

// Turns any failed request into a short, non-technical message
export const errorMessage = (err, fallback) =>
  err.response?.data?.message || (err.request ? 'Cannot reach the server. Check your connection and try again.' : fallback);
