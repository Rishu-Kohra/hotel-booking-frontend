import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';
import { bookings } from '../services/api';
import { useNavigate } from 'react-router-dom';

function MyBookings() {
    const navigate = useNavigate();
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const customerId = localStorage.getItem('userId');
        const response = await bookings.getCustomerBookings(customerId);
        setBookingList(response.data);
      } catch (error) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookings.cancel(bookingId);
      setBookingList(bookingList.filter(booking => booking.bookingId !== bookingId));
    } catch (error) {
      setError('Failed to cancel booking');
    }
  };

  const getBookingStatus = (booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const checkout = new Date(booking.checkoutDate);

    if (now > checkout) {
      return { label: 'Completed', color: 'success' };
    } else if (now >= checkIn && now <= checkout) {
      return { label: 'Active', color: 'primary' };
    } else {
      return { label: 'Upcoming', color: 'warning' };
    }
  };

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
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
      {bookingList.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          You don't have any bookings yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bookingList.map((booking) => {
            const status = getBookingStatus(booking);
            return (
              <Grid item xs={12} key={booking.bookingId}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="h6" gutterBottom>
                          {booking.hotel.hotelName}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Room Type: {booking.roomType.typeName}
                        </Typography>
                        <Typography variant="body2">
                          Check-in: {format(new Date(booking.checkInDate), 'PPP')}
                        </Typography>
                        <Typography variant="body2">
                          Check-out: {format(new Date(booking.checkoutDate), 'PPP')}
                        </Typography>
                        <Typography variant="body2">
                          Number of Rooms: {booking.numberOfRooms}
                        </Typography>
                        <Typography variant="body2">
                          Total Price: ${booking.totalPrice}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Chip
                          label={status.label}
                          color={status.color}
                          sx={{ mb: 2 }}
                        />
                        {status.label === 'Upcoming' && (
                          <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' , gap:2, width: 150}}>
                            <Button
                              variant="contained"
                              fullWidth
                              sx={{ fontSize: '13px' }}
                              onClick={() => navigate(`/hotels/${booking.hotel.hotelId}`)}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              fullWidth
                              sx={{ fontSize: '13px' }}
                              onClick={() => handleCancelBooking(booking.bookingId)}
                            >
                              Cancel Booking
                            </Button>
                            
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default MyBookings; 