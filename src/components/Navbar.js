import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logorect from '../Images/logo-rectangle.png';

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
    <AppBar position="static" sx={{backgroundColor: 'black'}}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none'}}>
          <img src={logorect} alt="Instastay Logo" width={200} height={65}/>
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
              {userRole === 'CUSTOMER' && (
                <div>
                  <Button color="inherit" component={Link} to="/hotels">
                    Hotels
                  </Button>
                  <Button color="inherit" component={Link} to="/my-bookings">
                    My Bookings
                  </Button> 
                </div>             
              )}
              {userRole === 'OWNER' && ( 
                <div>  
                  <Button color="inherit" component={Link} to="/hotelBookings">
                    Inventory
                  </Button> 
                  <Button color="inherit" component={Link} to="/hotelBookings">
                    Hotel Bookings
                  </Button>             
                  <Button color="inherit" component={Link} to="/owner-dashboard">
                    Dashboard
                  </Button>
                  
                </div> 
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
