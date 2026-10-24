import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const linkSx = {
  color: 'inherit',
  borderRadius: 0,
  borderBottom: '2px solid transparent',
  '&.active': { borderBottomColor: '#e8c48f' },
};

export default function Navbar() {
  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <MenuBookIcon sx={{ mr: 1 }} aria-hidden />
        <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
          Library Catalogue
        </Typography>
        <Box component="nav">
          <Button component={NavLink} to="/" end sx={linkSx}>Dashboard</Button>
          <Button component={NavLink} to="/add" sx={linkSx}>Add book</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
