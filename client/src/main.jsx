import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App.jsx';

const theme = createTheme({
  palette: {
    primary: { main: '#1f4d3a' },
    secondary: { main: '#a4642a' },
    background: { default: '#f6f5f1' },
  },
  shape: { borderRadius: 6 },
  typography: { fontFamily: 'Georgia, "Times New Roman", serif', button: { textTransform: 'none' } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
