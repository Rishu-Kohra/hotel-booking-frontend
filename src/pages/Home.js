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
import FAQ from '../components/FAQ';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer'
import '../index.css'

function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    navigate(`/hotels?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url(${hotelbg})`,
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
                  Search hotels by city, name,  or etc
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter city, hotel, name, or etc "
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
      <Box>
        <HotelList/>
        <Destination/>
        <Feedback/>
        <FAQ/>
        <Footer/>
      </Box>
    </Box>
  );
}

export default Home; 