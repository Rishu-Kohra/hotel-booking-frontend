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
  FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CheckBox } from '@mui/icons-material';
import { hotels, roomTypes } from '../services/api';

function OwnerDashboard() {
  const [hotelList, setHotelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openHotelDialog, setOpenHotelDialog] = useState(false);
  const [openRoomTypeDialog, setOpenRoomTypeDialog] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [hotelForm, setHotelForm] = useState({
    hotelName: '',
    description: '',
    city: '',
    state: '',
    country: '',
    address: '',
    landmark: '',
    hotelEmailId: '',
    wifi: null,
    breakfast: false,
    swimmingPool: false,
    gym: false,
    bar: false,
    ratings: 0
  });
  const [roomTypeForm, setRoomTypeForm] = useState({

    typeName: '',
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

      const hotelsWithRoomTypes = await Promise.all(
        response.data.map(async (hotel) => {
          const roomTypesResponse = await roomTypes.getByHotel(hotel.hotelId);
          return {
            ...hotel,
            roomTypes: roomTypesResponse.data
          };
        })
      )
      setHotelList(hotelsWithRoomTypes);

    } catch (error) {
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSubmit = async () => {
    try {
      const ownerId = localStorage.getItem('userId');
      console.log('Owner ID:', ownerId);
      if (selectedHotel) {
        await hotels.update(selectedHotel.hotelId, { ...hotelForm, ownerId });
      } else {
        await hotels.create(ownerId, { ...hotelForm });
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

      const updatedRoomTypeForm = {
        ...roomTypeForm,
        hotelId: selectedHotel.hotelId,
      };

      if (selectedRoomType) {
        await roomTypes.update(selectedRoomType.roomTypeId, updatedRoomTypeForm)
      } else {
        await roomTypes.create(updatedRoomTypeForm);
      }
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
      await roomTypes.delete(roomTypeId);
      fetchHotels();
    } catch (error) {
      setError('Failed to delete room type');
    }
  };

  const resetHotelForm = () => {
    setHotelForm({
      hotelName: '',
      description: '',
      city: '',
      state: '',
      country: '',
      address: '',
      landmark: '',
      hotelEmailId: '',
      wifi: null,
      breakfast: false,
      swimmingPool: false,
      gym: false,
      bar: false,
      ratings: 0

    });
    setSelectedHotel(null);
  };

  const resetRoomTypeForm = () => {
    setRoomTypeForm({
      typeName: '',
      price: '',
      totalRooms: '',
    });
    setSelectedRoomType(null);
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
                        setRoomTypeForm({
                          room: hotel.hotelName,
                          description: hotel.description,
                          city: hotel.city,
                          state: hotel.state,
                          country: hotel.country,
                          address: hotel.address,
                          landmark: hotel.landmark,
                          hotelEmailId: hotel.hotelEmailId,

                          wifi: hotel.wifi,
                          breakfast: hotel.breakfast,
                          swimmingPool: hotel.swimmingPool,
                          gym: hotel.gym,
                          bar: hotel.bar,

                          ratings: hotel.ratings

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
                <Typography variant="body2">
                  Address: {hotel.address + ", " + hotel.city + ", " + hotel.state + ", " + hotel.country}
                </Typography>
                <Typography variant="body2">Email: {hotel.hotelEmailId}</Typography>
                {/* <Typography variant="body2">
                  Amenities: {hotel.amenities.join(', ')}
                </Typography> */}

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
                          secondary={`${roomType.totalRooms} rooms - Rs.${roomType.price}/night`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => {
                              setSelectedHotel(hotel);
                              setSelectedRoomType(roomType);
                              setRoomTypeForm({
                                typeName: roomType.typeName,
                                price: roomType.price,
                                totalRooms: roomType.totalRooms
                              });
                              setOpenRoomTypeDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
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
              label="Description"
              value={hotelForm.description}
              onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="City"
              value={hotelForm.city}
              onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="State"
              value={hotelForm.state}
              onChange={(e) => setHotelForm({ ...hotelForm, state: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Country"
              value={hotelForm.country}
              onChange={(e) => setHotelForm({ ...hotelForm, country: e.target.value })}
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
              label="Landmark"
              value={hotelForm.landmark}
              onChange={(e) => setHotelForm({ ...hotelForm, landmark: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={hotelForm.hotelEmailId}
              onChange={(e) => setHotelForm({ ...hotelForm, hotelEmailId: e.target.value })}
              sx={{ mb: 2 }}
            />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div>
                <label>
                  Wifi:
                  <input
                    type="checkbox"
                    name="wifi"
                    checked={hotelForm.wifi}
                    onChange={
                      (e) => {
                        setHotelForm({ ...hotelForm, wifi: e.target.checked })
                      }
                    }
                  />
                </label>
              </div>
              <div>
                <label>
                  BreakFast:
                  <input
                    type="checkbox"
                    name="BreakFast"
                    checked={hotelForm.breakfast}
                    onChange={(e) => {
                      setHotelForm({ ...hotelForm, breakfast: e.target.checked })

                    }
                    }
                  />
                </label>
              </div>
              <div>
                <label>
                  Pool:
                  <input
                    type="checkbox"
                    name="Swimming Pool"
                    checked={hotelForm.swimmingPool}
                    onChange={(e) => setHotelForm({
                      ...hotelForm,
                      swimmingPool: e.target.checked
                    })}
                  />
                </label>
              </div>
              <div>
                <label>
                  Gym:
                  <input
                    type="checkbox"
                    name="Gym"
                    checked={hotelForm.gym}
                    onChange={(e) => setHotelForm({
                      ...hotelForm,
                      gym: e.target.checked
                    })}
                  />
                </label>
              </div>
              <div>
                <label>
                  Bar:
                  <input
                    type="checkbox"
                    name="Bar"
                    checked={hotelForm.bar}
                    onChange={(e) => setHotelForm({
                      ...hotelForm,
                      bar: e.target.checked
                    })}
                  />
                </label>
              </div>
            </div>
            <TextField
              fullWidth
              label="Ratings"
              value={hotelForm.ratings}
              onChange={(e) => setHotelForm({ ...hotelForm, ratings: e.target.value })}
              sx={{ mb: 2 }}
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