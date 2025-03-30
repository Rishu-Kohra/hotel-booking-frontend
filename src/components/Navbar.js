import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          InstaStay
        </Typography>
        <Box>
          {!token ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/hotels">
                Hotels
              </Button>
              {userRole === 'CUSTOMER' && (
                <Button color="inherit" component={Link} to="/my-bookings">
                  My Bookings
                </Button>
              )}
              {userRole === 'OWNER' && (
                <Button color="inherit" component={Link} to="/owner-dashboard">
                  Dashboard
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 
