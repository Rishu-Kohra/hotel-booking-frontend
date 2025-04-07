import React, { useState, useEffect } from 'react';
import hotelimg from '../Images/hotel-bg.jpg';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { hotels } from '../services/api';
import SearchIcon from '@mui/icons-material/Search';

import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns'


function HotelList(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';

  const [hotelList, setHotelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
      checkInDate: null,
      checkoutDate: null,
      city: '',
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await hotels.search(searchTerm);
        setHotelList(response.data);
      } catch (error) {
        setError('Failed to fetch hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchTerm]);

  const renderAmenities = (hotel) => (
    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {hotel.wifi && <Chip icon={<WifiIcon />} label="WiFi" size="small" />}
      {hotel.breakfast && <Chip icon={<RestaurantIcon />} label="Breakfast" size="small" />}
      {hotel.swimmingPool && <Chip icon={<PoolIcon />} label="Pool" size="small" />}
      {hotel.gym && <Chip icon={<FitnessCenterIcon />} label="Gym" size="small" />}
      {hotel.bar && <Chip icon={<LocalBarIcon />} label="Bar" size="small" />}
    </Box>
  );

  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const handleCityChange = (e) => {
    setFormData({
      ...formData,
      city: e.target.value,
    });
  };

  const handleSearch = async () => {
    try{
      const checkIn = format(formData.checkInDate, 'yyyy-MM-dd')
      const checkOut = format(formData.checkoutDate, 'yyyy-MM-dd')
      const response = await hotels.getAvailableRoomsByCityAndDate(checkIn, checkOut, formData.city);
      console.log(response.data);
      setHotelList(response.data);
    } catch(err) {
      setError("Error Fetching the Available Hotels");
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        {searchTerm ? `Search Results for "${searchTerm}"` : 'All Hotels'}
      </Typography>
      <Grid sx={{display:'flex', justifyContent:'center', alignContent:'center', flexDirection:'row', gap: 5, margin:'20px'}} >
        <Grid item xs={5} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Check-in Date"
              value={formData.checkInDate}
              onChange={handleDateChange('checkInDate')}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Check-out Date"
              value={formData.checkoutDate}
              onChange={handleDateChange('checkoutDate')}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={formData.checkInDate || new Date()}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            type="text"
            value={formData.city}
            onChange={handleCityChange}
          />
        </Grid>
        <Button
          variant="contained"
          size="large"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Grid>
      <Grid container spacing={3}>
        {hotelList.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel.hotelId}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={hotelimg}
                alt={hotel.hotelName}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {hotel.hotelName}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {hotel.city}, {hotel.state}
                </Typography>
                <Rating value={hotel.ratings || 0} readOnly />
                {renderAmenities(hotel)}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/hotels/${hotel.hotelId}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default HotelList; 