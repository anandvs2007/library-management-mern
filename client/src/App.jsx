import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookForm from './pages/BookForm.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" component="main" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<BookForm />} />
          <Route path="/edit/:id" element={<BookForm />} />
        </Routes>
      </Container>
    </>
  );
}
