import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    navigate(`/hotels?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/hotel-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h3" component="h1" gutterBottom>
                Find Your Perfect Stay
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Search hotels by city, amenities, or name
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter city, hotel name, or amenities"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home; 