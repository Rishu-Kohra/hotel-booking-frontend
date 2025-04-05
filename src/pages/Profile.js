import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Alert, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { userService } from '../services/api'; // Import user service

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    contact: '',
  });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await userService.getUserProfile();
        setUserInfo({
          name: data.name,
          email: data.email,
          contact: data.contact,
        });
      } catch (err) {
        setError('Failed to fetch user profile.');
      }
    };

    fetchUserProfile();
  }, []);

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

  const handleEditSubmit = () => {
    // Implement logic to update user info
    console.log('Updated user info:', userInfo);
    setOpenEditDialog(false);
    setSuccessMessage('Profile updated successfully!');
  };

  const handleDeleteAccount = async () => {
    // Implement account deletion logic here
    try {
      await userService.deleteUserAccount(); // Assuming you have a delete method in your userService
      console.log('Account deleted');
      // Redirect to login or home page after deletion
    } catch (err) {
      setError('Failed to delete account.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h6">Name: {userInfo.name} <IconButton onClick={() => setOpenEditDialog(true)}><EditIcon /></IconButton></Typography>
      <Typography variant="h6">Email: {userInfo.email}</Typography>
      <Typography variant="h6">Contact: {userInfo.contact} <IconButton onClick={() => setOpenEditDialog(true)}><EditIcon /></IconButton></Typography>
      <Button variant="contained" color="error" onClick={handleDeleteAccount} startIcon={<DeleteIcon />}>
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
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact"
            value={userInfo.contact}
            onChange={(e) => setUserInfo({ ...userInfo, contact: e.target.value })}
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
