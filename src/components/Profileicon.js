import React,{useRef} from 'react';
import { Avatar } from '@mui/material';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Profileicon = ({ name, width, height, fontSize }) => {
  const initial = name.charAt(0).toUpperCase();
  const colorRef = useRef(getRandomColor());

  return (
    <Avatar sx={{ bgcolor: colorRef.current, width: width, height: height, color: 'black', fontSize: fontSize }}>
      {initial}
    </Avatar>
  );
};

export default Profileicon;