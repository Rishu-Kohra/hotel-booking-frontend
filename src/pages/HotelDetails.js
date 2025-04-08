import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  Rating,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import HotelImage from '../components/HotelImage'
import { useParams, useNavigate } from 'react-router-dom';
import { hotels, roomTypes, images } from '../services/api';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
 
function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        const [hotelResponse, roomsResponse, imageResponse] = await Promise.all([
          hotels.getById(id),
          roomTypes.getByHotel(id),
          images.getImage(id),
        ]);
        setHotel(hotelResponse.data);
        setRooms(roomsResponse.data);
        setImage(imageResponse.data[0]);
      } catch (error) {
        setError('Failed to fetch hotel details');
      } finally {
        setLoading(false);
      }
    };
 
    fetchHotelDetails();
  }, [id]);
 
  const renderAmenities = () => (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
      {hotel.wifi && <Chip icon={<WifiIcon />} label="WiFi" />}
      {hotel.breakfast && <Chip icon={<RestaurantIcon />} label="Breakfast" />}
      {hotel.swimmingPool && <Chip icon={<PoolIcon />} label="Swimming Pool" />}
      {hotel.gym && <Chip icon={<FitnessCenterIcon />} label="Gym" />}
      {hotel.bar && <Chip icon={<LocalBarIcon />} label="Bar" />}
    </Box>
  );
 
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
 
  if (error || !hotel) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error || 'Hotel not found'}
        </Typography>
      </Container>
    );
  }
 
  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          
          <Typography variant="h4" gutterBottom>
            {hotel.hotelName}
          </Typography>
          <Typography variant="body1">
              {hotel.description}
            </Typography>
         
          <Box sx={{ mb: 2, mt:2 }}>
            <Rating value={hotel.ratings || 0} readOnly />
          </Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon color="action" />
            <Typography>
              {hotel.address}, {hotel.city}, {hotel.state}, {hotel.country}
            </Typography>
          </Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="action" />
            <Typography>{hotel.hotelEmailId}</Typography>
          </Box>
          {renderAmenities()}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Available Rooms
          </Typography>
          <List>
            {rooms.map((room) => (
              <Card key={room.roomTypeId} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{room.typeName}</Typography>
                  <Typography color="text.secondary" gutterBottom>
                    Price: &#8377;{room.price} per night
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/booking/${hotel.hotelId}?roomType=${room.roomTypeId}`)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={4}>
          <HotelImage hotelId={hotel.hotelId} width={'100%'} height={250}/>
        </Grid>
       
      </Grid>
    </Container>
  );
}
 
export default HotelDetails;