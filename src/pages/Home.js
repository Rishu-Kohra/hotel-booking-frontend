import React, { useState } from 'react';
import hotelbg from '../Images/hotel-bg.jpg';
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
import HotelList from './HotelList';
import Destination from '../components/Destinations';

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    navigate(`/hotels?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Box sx={{mb:5}}>
      <Box
        sx={{
          backgroundImage: `url(${hotelbg})`,
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
                  Discover Your Dream Stay
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
      <Box sx={{mt:5, mb:5}}>
        <HotelList/>
        <Destination/>
      </Box>
    </Box>
  );
}

export default Home; 