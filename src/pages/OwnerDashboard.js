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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { hotels, roomTypes } from '../services/api';

function OwnerDashboard() {
  const [hotelList, setHotelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openHotelDialog, setOpenHotelDialog] = useState(false);
  const [openRoomTypeDialog, setOpenRoomTypeDialog] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelForm, setHotelForm] = useState({
    hotelName: '',
    address: '',
    email: '',
    description: '',
    amenities: '',
  });
  const [roomTypeForm, setRoomTypeForm] = useState({
    typeName: '',
    description: '',
    price: '',
    totalRooms: '',
  });

  useEffect(() => {
    fetchHotels();
  }, []);

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

  const handleHotelSubmit = async () => {
    try {
      const ownerId = localStorage.getItem('userId');
      if (selectedHotel) {
        await hotels.update(selectedHotel.hotelId, { ...hotelForm, ownerId });
      } else {
        await hotels.create({ ...hotelForm, ownerId });
      }
      setOpenHotelDialog(false);
      fetchHotels();
      resetHotelForm();
    } catch (error) {
      setError('Failed to save hotel');
    }
  };

  const handleRoomTypeSubmit = async () => {
    try {
      if (!selectedHotel) return;
      await roomTypes.create(selectedHotel.hotelId, roomTypeForm);
      setOpenRoomTypeDialog(false);
      fetchHotels();
      resetRoomTypeForm();
    } catch (error) {
      setError('Failed to save room type');
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    try {
      await hotels.delete(hotelId);
      fetchHotels();
    } catch (error) {
      setError('Failed to delete hotel');
    }
  };

  const handleDeleteRoomType = async (hotelId, roomTypeId) => {
    try {
      await roomTypes.delete(hotelId, roomTypeId);
      fetchHotels();
    } catch (error) {
      setError('Failed to delete room type');
    }
  };

  const resetHotelForm = () => {
    setHotelForm({
      hotelName: '',
      address: '',
      email: '',
      description: '',
      amenities: '',
    });
    setSelectedHotel(null);
  };

  const resetRoomTypeForm = () => {
    setRoomTypeForm({
      typeName: '',
      description: '',
      price: '',
      totalRooms: '',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">My Hotels</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetHotelForm();
            setOpenHotelDialog(true);
          }}
        >
          Add Hotel
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {hotelList.map((hotel) => (
          <Grid item xs={12} key={hotel.hotelId}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5">{hotel.hotelName}</Typography>
                  <Box>
                    <IconButton
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setHotelForm({
                          hotelName: hotel.hotelName,
                          address: hotel.address,
                          email: hotel.email,
                          description: hotel.description,
                          amenities: hotel.amenities.join(','),
                        });
                        setOpenHotelDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteHotel(hotel.hotelId)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {hotel.description}
                </Typography>
                <Typography variant="body2">Address: {hotel.address}</Typography>
                <Typography variant="body2">Email: {hotel.email}</Typography>
                <Typography variant="body2">
                  Amenities: {hotel.amenities.join(', ')}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Room Types</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setSelectedHotel(hotel);
                        resetRoomTypeForm();
                        setOpenRoomTypeDialog(true);
                      }}
                    >
                      Add Room Type
                    </Button>
                  </Box>
                  <List>
                    {hotel.roomTypes?.map((roomType) => (
                      <ListItem key={roomType.roomTypeId}>
                        <ListItemText
                          primary={roomType.typeName}
                          secondary={`${roomType.totalRooms} rooms - $${roomType.price}/night`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => handleDeleteRoomType(hotel.hotelId, roomType.roomTypeId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Hotel Dialog */}
      <Dialog open={openHotelDialog} onClose={() => setOpenHotelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedHotel ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Hotel Name"
              value={hotelForm.hotelName}
              onChange={(e) => setHotelForm({ ...hotelForm, hotelName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Address"
              value={hotelForm.address}
              onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={hotelForm.email}
              onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={hotelForm.description}
              onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Amenities (comma-separated)"
              value={hotelForm.amenities}
              onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHotelDialog(false)}>Cancel</Button>
          <Button onClick={handleHotelSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Room Type Dialog */}
      <Dialog
        open={openRoomTypeDialog}
        onClose={() => setOpenRoomTypeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Room Type</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Room Type Name"
              value={roomTypeForm.typeName}
              onChange={(e) => setRoomTypeForm({ ...roomTypeForm, typeName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={roomTypeForm.description}
              onChange={(e) => setRoomTypeForm({ ...roomTypeForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Price per Night"
              type="number"
              value={roomTypeForm.price}
              onChange={(e) => setRoomTypeForm({ ...roomTypeForm, price: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Total Rooms"
              type="number"
              value={roomTypeForm.totalRooms}
              onChange={(e) => setRoomTypeForm({ ...roomTypeForm, totalRooms: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoomTypeDialog(false)}>Cancel</Button>
          <Button onClick={handleRoomTypeSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default OwnerDashboard; 