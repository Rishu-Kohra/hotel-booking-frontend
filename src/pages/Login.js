import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
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

  const handleChange = (e) => {
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
      const { id,email,token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id)
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role
      localStorage.setItem('userRole', role);
    navigate(role === 'OWNER' ? '/owner-dashboard' : '/hotels');
    } catch (error) {
      setError('Invalid email or password');
    }
  };
  

  return (
    <Box sx={{backgroundColor:`url(${hotelbg})`}}>
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}
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
