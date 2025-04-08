import React, { useState } from 'react';
import { Container, Paper, Alert, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import hotelbg from '../Images/hotel-bg.jpg';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleChange = (e) => {
    setError('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      const response = await auth.login(formData.email, formData.password);
      const { id, email, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id)
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role
      localStorage.setItem('userRole', role);
      setSuccessMessage("You have been Logged In !!!")

      setTimeout(() => {
        navigate(role === 'OWNER' ? '/owner-dashboard' : '/');
      }, 1000);
    } catch (error) {
      setError('Invalid email or password');
    }
  };


  return (
    <Box sx={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url(${hotelbg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
    }}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb:4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Login
            </Typography>
            {error && (
              <Typography color="error" align="center" gutterBottom>
                {error}
              </Typography>
            )}
            {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default Login; 
