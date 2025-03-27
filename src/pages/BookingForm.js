import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { hotels, roomTypes, bookings } from '../services/api';

function BookingForm() {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const roomTypeId = searchParams.get('roomType');

  const [hotel, setHotel] = useState(null);
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    checkInDate: null,
    checkoutDate: null,
    numberOfRooms: 1,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [hotelResponse, roomTypeResponse] = await Promise.all([
          hotels.getById(hotelId),
          roomTypes.getByHotel(hotelId),
        ]);
        setHotel(hotelResponse.data);
        const selectedRoomType = roomTypeResponse.data.find(
          (room) => room.roomTypeId === roomTypeId
        );
        setRoomType(selectedRoomType);
      } catch (error) {
        setError('Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [hotelId, roomTypeId]);

  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const handleNumberOfRoomsChange = (e) => {
    const value = Math.max(1, Math.min(parseInt(e.target.value) || 1, roomType?.totalRooms || 1));
    setFormData({
      ...formData,
      numberOfRooms: value,
    });
  };

  const calculateTotalPrice = () => {
    if (!roomType || !formData.checkInDate || !formData.checkoutDate) return 0;
    const days = Math.ceil(
      (formData.checkoutDate - formData.checkInDate) / (1000 * 60 * 60 * 24)
    );
    return roomType.price * days * formData.numberOfRooms;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerId = localStorage.getItem('userId'); // You need to store this during login
      const bookingData = {
        hotelId,
        roomTypeId,
        checkInDate: formData.checkInDate,
        checkoutDate: formData.checkoutDate,
        numberOfRooms: formData.numberOfRooms,
      };
      await bookings.create(customerId, bookingData);
      navigate('/my-bookings');
    } catch (error) {
      setError('Failed to create booking');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !hotel || !roomType) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Invalid booking details'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book Your Stay
        </Typography>
        <Typography variant="h6" gutterBottom>
          {hotel.hotelName} - {roomType.typeName}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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
                label="Number of Rooms"
                type="number"
                value={formData.numberOfRooms}
                onChange={handleNumberOfRoomsChange}
                inputProps={{ min: 1, max: roomType.totalRooms }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">
                Total Price: ${calculateTotalPrice()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!formData.checkInDate || !formData.checkoutDate}
              >
                Confirm Booking
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default BookingForm; 