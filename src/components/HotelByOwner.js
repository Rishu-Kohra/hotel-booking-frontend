import React, { useEffect, useState } from 'react';
import hotelimg from '../Images/hotel-bg.jpg';
import { hotels } from '../services/api';

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
  CircularProgress,
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { useNavigate } from 'react-router-dom';
import { Hotel } from '@mui/icons-material';
import HotelImage from '../components/HotelImage';

function HotelByOwner() {
    const navigate = useNavigate();
    const [hotelList, setHotelList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchHotels = async () => {
        try {
          setLoading(true);
          const ownerId = localStorage.getItem('userId');
          const response = await hotels.getByOwner(ownerId);
          setHotelList(response.data);
        } catch (error) {
          setError('Failed to fetch hotels');
        } finally {
          setLoading(false);
        }
      };
  
      fetchHotels();
    }, []);
  
    const renderAmenities = (hotel) => (
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {hotel.wifi && <Chip icon={<WifiIcon />} label="WiFi" size="small" />}
        {hotel.breakfast && <Chip icon={<RestaurantIcon />} label="Breakfast" size="small" />}
        {hotel.swimmingPool && <Chip icon={<PoolIcon />} label="Pool" size="small" />}
        {hotel.gym && <Chip icon={<FitnessCenterIcon />} label="Gym" size="small" />}
        {hotel.bar && <Chip icon={<LocalBarIcon />} label="Bar" size="small" />}
      </Box>
    );
  
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
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" align='center' gutterBottom>
            My Hotels
        </Typography>
        {hotelList.length > 0 ? (
          <Grid container spacing={3}>
            {hotelList.map((hotel) => (
              <Grid item xs={12} sm={6} md={4} key={hotel.hotelId}>
                <Card>
                  <HotelImage hotelId={hotel.hotelId} height={250} width={'100%'} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {hotel.hotelName}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {hotel.city}, {hotel.state}
                    </Typography>
                    <Rating value={hotel.ratings || 0} readOnly />
                    {renderAmenities(hotel)}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ):(
          <>
          <Box sx={{justifyContent:'center', alignItems:'center', textAlign:'center', gap:4}}>
            <Typography variant='h6' color={'red'}gutterBottom>You do not have registered hotels</Typography>
            <Typography variant='body1' color={'gray'}gutterBottom>Click on the <a href='/owner-dashboard' style={{color:'black', fontWeight:'bold'}}>dashboard</a> to add Hotels.</Typography>
          </Box>
          </>
        )}
        
      </Container>
    );
  }
  
  export default HotelByOwner; 
