import React from 'react';
import { Avatar } from '@mui/material';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Profileicon = ({ name }) => {
  const initial = name.charAt(0).toUpperCase();
  const backgroundColor = getRandomColor();

  return (
    <Avatar sx={{ bgcolor: backgroundColor, width: 100, height: 100, color: 'black', fontSize: 40 }}>
      {initial}
    </Avatar>
  );
};

export default Profileicon;