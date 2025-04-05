import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Alert, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { userProfile } from '../services/api'; 
import { useNavigate } from 'react-router-dom';

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
  const [feedback, setFeedback] = useState('');
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
      const response = await userProfile.getCustomerProfile(userId);
      setUserInfo({
        name: response.data.customerName,
        email: response.data.customerEmailId,
        contact: response.data.customerContact,
      });
      setUpdateInfo({
        name: response.data.customerName,
        contact: response.data.customerContact
      })
    } catch (err) {
      setError('Failed to fetch user profile.');
    }
  };


  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // Implement feedback submission logic here
    console.log('Feedback submitted:', feedback);
    setSuccessMessage('Thank you for your feedback!');
    setFeedback(''); // Clear the feedback input
  };

  const handleEditSubmit = async () => {
    try {
      await userProfile.updateCustomerProfile(userId, {...updateInfo}); 
      setOpenEditDialog(false);
      fetchUserProfile();
      setSuccessMessage('Profile updated successfully!');
    }catch(err) {
      setError("Update Not Possible")
    }
    
  };

  const handleDeleteAccount = async () => {
    // Implement account deletion logic here
    try {
      await userProfile.deleteCustomerProfile(userId); // Assuming you have a delete method in your userService
      console.log('Account deleted');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      navigate('/login');
    } catch (err) {
      setError('Failed to delete account.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 2, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h4" align='center' gutterBottom>
        My Profile <IconButton onClick={() => setOpenEditDialog(true)}><EditIcon /></IconButton>
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h6" sx={{ mt: 2 }}>Name: {userInfo.name}</Typography>
      <Typography variant="h6">Email: {userInfo.email}</Typography>
      <Typography variant="h6">Contact: {userInfo.contact}</Typography>
      <Button variant="contained" color="error" onClick={handleDeleteAccount} startIcon={<DeleteIcon />} sx={{ mt: 2 }}>
        Delete Account
      </Button>
  
      <Typography variant="h5" sx={{ mt: 4 }}>
        Feedback
      </Typography>
      <form onSubmit={handleFeedbackSubmit}>
        <TextField
          label="Your Feedback"
          multiline
          rows={4}
          value={feedback}
          onChange={handleFeedbackChange}
          fullWidth
          required
          sx={{ mt: 2 }}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit Feedback
        </Button>
      </form>
      {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
  
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
  );
};

export default ProfilePage;
