import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      
    });
    setError(" ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = formData.password;
    const specialChar = /[!@#$%^&*()<>,.?":{}|]/;
    const numberRegex = /\d/
    const uppercaseRegex = /[A-Z]/
    const lowercaseRegex = /[a-z]/
    const contactRegex = /^[6-9]\d{9}$/
    if (specialChar.test(formData.name) || numberRegex.test(formData.name)) {
      setError("Please enter valid name")
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!specialChar.test(password)) {
      setError('Password must contain a special character.');
      return;
    }
    if (!numberRegex.test(password)) {
      setError('Password must contain a number.');
      return;
    }
    if (!uppercaseRegex.test(password)) {
      setError('Password must have atleast 1 uppercase character.');
      return;
    }
    if (!lowercaseRegex.test(password)) {
      setError('Password must have atleast 1 lowercase character.');
      return;
    }
    if (!contactRegex.test(formData.contact)) {
      setError('Please enter a valid contact number.');
      return;
    }
    try {
      const data = {
        [userType === 'customer' ? 'customerName' : 'ownerName']: formData.name,
        [userType === 'customer' ? 'customerEmailId' : 'ownerEmailId']: formData.email,
        password: formData.password,
        [userType === 'customer' ? 'customerContact' : 'ownerContact']: formData.contact,
      };

      if (userType === 'customer') {
        await auth.registerCustomer(data);
      } else {
        await auth.registerOwner(data);
      }

      navigate('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Register
          </Typography>
          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}
          <RadioGroup
            row
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            sx={{ justifyContent: 'center', mb: 2 }}
          >
            <FormControlLabel value="customer" control={<Radio />} label="Customer" />
            <FormControlLabel value="owner" control={<Radio />} label="Hotel Owner" />
          </RadioGroup>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
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
            <TextField
              fullWidth
              label="Contact Number"
              name="contact"
              value={formData.contact}
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
              Register
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register; 