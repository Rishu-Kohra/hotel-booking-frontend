import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { inventory } from '../services/api';

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const ownerId = localStorage.getItem('userId'); // Assuming you have the owner ID stored in local storage
        const response = await inventory.getInventoryByOwner(ownerId); // Adjust the API call as needed
        
        // Process the response to separate by hotelId
        const organizedData = {};
        response.data.forEach(hotelInventoryList => {
          hotelInventoryList.forEach(entry => {
            const { hotelId, date, totalRooms, availableRooms, bookedRooms } = entry;

            // Initialize the hotel entry if it doesn't exist
            if (!organizedData[hotelId]) {
              organizedData[hotelId] = {
                hotelName: entry.hotelName, // Assuming hotelName is part of the entry
                inventory: []
              };
            }

            // Push the inventory record for the hotel
            organizedData[hotelId].inventory.push({
              date,
              totalRooms,
              availableRooms,
              bookedRooms
            });
          });
        });

        setInventoryData(organizedData);
      } catch (err) {
        setError('Failed to fetch inventory data');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>
      {Object.keys(inventoryData).map((hotelId) => (
        <Box key={hotelId} sx={{ mb: 4 }}>
          <Typography variant="h5">{inventoryData[hotelId].hotelName}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Rooms</TableCell>
                  <TableCell>Available Rooms</TableCell>
                  <TableCell>Booked Rooms</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventoryData[hotelId].inventory.map((entry) => (
                  <TableRow key={entry.date}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.totalRooms}</TableCell>
                    <TableCell>{entry.availableRooms}</TableCell>
                    <TableCell>{entry.bookedRooms}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Container>
  );
};

export default Inventory;
