import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Alert, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { userProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';
import  HotelByOwner  from '../components/HotelByOwner'
 
const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    contact: '',
  });
  const [updateInfo, setUpdateInfo] = useState({
    name: '',
    contact: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
 
  useEffect(() => {
    fetchUserProfile();
  }, []);
 
  const fetchUserProfile = async () => {
    try {
      const response = await userProfile.getOwnerProfile(userId);
      setUserInfo({
        name: response.data.ownerName,
        email: response.data.ownerEmailId,
        contact: response.data.ownerContact,
      });
      setUpdateInfo({
        name: response.data.ownerName,
        contact: response.data.ownerContact
      })
    } catch (err) {
      setError('Failed to fetch user profile.');
    }
  };
 
  const handleEditSubmit = async () => {
    try {
      await userProfile.updateOwnerProfile(userId, {...updateInfo});
      setOpenEditDialog(false);
      fetchUserProfile();
      setSuccessMessage('Profile updated successfully!');
    }catch(err) {
      setError("Update Not Possible")
    }
   
  };
 
  return (
    <Container sx={{ mt: 4, mb:2, p: 2, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
    <Container maxWidth="sm">
      <Typography variant="h4" align='center' gutterBottom>
        My Profile <IconButton onClick={() => setOpenEditDialog(true)}><EditIcon /></IconButton>
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h6" sx={{ mt: 2 }}>Name: {userInfo.name}</Typography>
      <Typography variant="h6">Email: {userInfo.email}</Typography>
      <Typography variant="h6">Contact: {userInfo.contact}</Typography>
      
 
      {/* Edit Profile Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={updateInfo.name}
            onChange={(e) => setUpdateInfo({ ...updateInfo, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact"
            value={updateInfo.contact}
            onChange={(e) => setUpdateInfo({ ...updateInfo, contact: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
    <HotelByOwner/>
    </Container>
  );
};
 
export default ProfilePage;