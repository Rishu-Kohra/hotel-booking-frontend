import React, { useState, useEffect, useRef } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import {
  Container,
  DialogContentText,
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
  Chip,
  Rating,
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
import { hotels, roomTypes, inventory, images } from '../services/api';
import axios from 'axios';
import HotelImage from '../components/HotelImage';

function OwnerDashboard() {
  const [hotelList, setHotelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hotelError, setHotelError] = useState('');
  const [roomError, setRoomError] = useState('');
  const [openHotelDialog, setOpenHotelDialog] = useState(false);
  const [openRoomTypeDialog, setOpenRoomTypeDialog] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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

  const [image, setImage] = useState(''); 

  const handleFileChange = (event) => {
    setError('')
    const file = event.target.files[0];
    if(file) {
      if(file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jfif') {
        console.log('selected file:', file.name)
        setImage(file);
      } else{
        setError('File not supported');
        setImage(null)
      }
    }
  };

  const handleButtonClick = async (hotelId) => {

      const formData = new FormData();
      formData.append('file',image)
      try{
        await images.uploadImage(hotelId, formData)
        setSuccessMessage('Your hotel photo has been added')
      } catch(err) {
        console.log("Error not uploading")
        setError("Photos not Added")
      }
  }

  const renderAmenities = (hotel) => (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
      {hotel.wifi && <Chip icon={<WifiIcon />} label="WiFi" />}
      {hotel.breakfast && <Chip icon={<RestaurantIcon />} label="Breakfast" />}
      {hotel.swimmingPool && <Chip icon={<PoolIcon />} label="Swimming Pool" />}
      {hotel.gym && <Chip icon={<FitnessCenterIcon />} label="Gym" />}
      {hotel.bar && <Chip icon={<LocalBarIcon />} label="Bar" />}
    </Box>
  );


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

  const validateHotelForm = () => {
    const specialChar = /[!@#$%^&*()<>,.?":{}|]/;
    const numberRegex = /\d/
    if (!hotelForm.hotelName || specialChar.test(hotelForm.hotelName)) {
      setHotelError('Please enter a valid hotel name.');
      return false;
    }
    if (!hotelForm.description || hotelForm.description.length < 10) {
      setHotelError('Description must be at least 10 characters long.');
      return false;
    }

    if (!hotelForm.city || specialChar.test(hotelForm.city) || numberRegex.test(hotelForm.city)) {
      setHotelError('Please enter a valid city name.');
      return false;
    }
    if (!hotelForm.state || specialChar.test(hotelForm.state) || numberRegex.test(hotelForm.state)) {
      setHotelError('Please enter a valid state name.');
      return false;
    }
    if (!hotelForm.country || specialChar.test(hotelForm.country) || numberRegex.test(hotelForm.country)) {
      setHotelError('Please enter a valid country name.');
      return false;
    }
    if (!hotelForm.address) {
      setHotelError('Address is required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(hotelForm.hotelEmailId)) {
      setHotelError('Please enter a valid email address.');
      return false;
    }
    if (hotelForm.ratings < 0 || hotelForm.ratings > 5) {
      setHotelError('Ratings must be between 0 and 5.');
      return false;
    }
    // Reset error if all validations pass
    setHotelError('');
    return true;
  };

  const validateRoomTypeForm = () => {
    const specialChar = /[!@#$%^&*()<>,.?":{}|]/;
    if (!roomTypeForm.typeName || specialChar.test(roomTypeForm.typeName)) {
      setRoomError('Please enter a valid roomtype name.');
      return false;
    }
    if (isNaN(roomTypeForm.price) || roomTypeForm.price <= 0) {
      setRoomError('Price must be a positive number.');
      return false;
    }
    if (isNaN(roomTypeForm.totalRooms) || roomTypeForm.totalRooms <= 0) {
      setRoomError('Total rooms must be a positive integer.');
      return false;
    }
    // Reset error if all validations pass
    setRoomError('');
    return true;
  };

  const handleHotelSubmit = async () => {
    if (!validateHotelForm()) {
      return; // Stop submission if validation fails
    }
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
    if (!validateRoomTypeForm()) {
      return; // Stop submission if validation fails
    }
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

  const handleAddInventory = async (roomTypeId) => {
    try{
      await inventory.intializeInventory(roomTypeId);
      setSuccessMessage("Inventory Added for one Month")
    } catch(err) {
      setError("Inventory can't be added")
    }
  }

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

      {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

      <Grid container spacing={3}>
        {hotelList.map((hotel) => (
          <Grid item xs={12} key={hotel.hotelId}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5">{hotel.hotelName}</Typography>
                  <Box sx={{display:'flex', flexDirection:'row'}}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                      <input type='file'name='file' onChange={handleFileChange}/>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={()=>handleButtonClick(hotel.hotelId)}
                      >
                        Upload Image
                      </Button>
                    </div>
                    <IconButton
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setHotelForm({
                          hotelName: hotel.hotelName,
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
                
                <Box sx={{ mb: 2, display: 'flex', gap: 60 }}>
              <Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon />
                  <Typography variant="body2">
                    {hotel.address + ", " + hotel.city + ", " + hotel.state + ", " + hotel.country}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon />
                  <Typography variant="body2">{hotel.hotelEmailId}</Typography>
                </Box>
                {renderAmenities(hotel)}
                <Box sx={{ mb: 2 }}>
                  <Rating value={hotel.ratings || 0} readOnly />
                </Box>
                  </Box>

              <Box>
                <HotelImage hotelId={hotel.hotelId} height={250} width={'100%'}/>
              </Box>
              </Box>

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
                          secondary={`${roomType.totalRooms} rooms - ₹${roomType.price}/night`}
                        />
                        <ListItemSecondaryAction>
                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => handleAddInventory(roomType.roomTypeId)}
                          >
                            Add Inventory
                          </Button>
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
        {hotelError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {hotelError}
          </Alert>
        )}
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Hotel Name"
              value={hotelForm.hotelName}
              onChange={(e) => {
                setHotelForm({
                  ...hotelForm, hotelName: e.target.value
                });
                setHotelError('');
              }}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={hotelForm.description}
              onChange={(e) => { setHotelForm({ ...hotelForm, description: e.target.value }); setHotelError('') }}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="City"
              value={hotelForm.city}
              onChange={(e) => { setHotelForm({ ...hotelForm, city: e.target.value }); setHotelError('') }}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="State"
              value={hotelForm.state}
              onChange={(e) => { setHotelForm({ ...hotelForm, state: e.target.value }); setHotelError('') }}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Country"
              value={hotelForm.country}
              onChange={(e) => { setHotelForm({ ...hotelForm, country: e.target.value }); setHotelError('') }}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Address"
              value={hotelForm.address}
              onChange={(e) => { setHotelForm({ ...hotelForm, address: e.target.value }); setHotelError('') }}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Landmark"
              value={hotelForm.landmark}
              onChange={(e) => { setHotelForm({ ...hotelForm, landmark: e.target.value }); setHotelError('') }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={hotelForm.hotelEmailId}
              onChange={(e) => { setHotelForm({ ...hotelForm, hotelEmailId: e.target.value }); setHotelError('') }}
              sx={{ mb: 2 }}
              required
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
              onChange={(e) => { setHotelForm({ ...hotelForm, ratings: e.target.value }); setHotelError('') }}
              sx={{ mb: 2 }}
              required
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
        <DialogTitle>{selectedRoomType ? 'Edit Room Type' : 'Add New Room Type'}</DialogTitle>
        {roomError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {roomError}
          </Alert>
        )}
        <DialogContent>
          <Box sx={{ mt: 2 }}>

            <TextField
              fullWidth
              label="Room Type Name"
              value={roomTypeForm.typeName}
              onChange={(e) => { setRoomTypeForm({ ...roomTypeForm, typeName: e.target.value }); setRoomError('') }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Price per Night (₹)"
              type="number"
              value={roomTypeForm.price}
              onChange={(e) => { setRoomTypeForm({ ...roomTypeForm, price: e.target.value }); setRoomError('') }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Total Rooms"
              type="number"
              value={roomTypeForm.totalRooms}
              onChange={(e) => { setRoomTypeForm({ ...roomTypeForm, totalRooms: e.target.value }); setRoomError('') }}
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

