import React from 'react';
import bangalore from '../Images/banglore.jpg';
import chennai from '../Images/chennai.jpg';
import delhi from '../Images/delhi.jpg';
import jaipur from '../Images/jaipur.jpg';
import mumbai from '../Images/mumbai.jpg';
import hyderabad from '../Images/hyderabad.jpg';

import {
    Container,
    Typography,
    Box,
    Card,
    Button,
    Paper,
    Grid,
    CardMedia,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Destination() {
    const cities = [
        {
            name:"Delhi",
            image:delhi
        },
        {
            name:"Bangalore",
            image:bangalore
        },
        {
            name:"Chennai",
            image:chennai
        },
        {
            name:"Hyderabad",
            image:hyderabad
        },
        {
            name:"Mumbai",
            image:mumbai
        },
        {
            name:"Jaipur",
            image:jaipur
        }
    ]
    
    const navigate = useNavigate();
    const handleSearch = (search) => { navigate(`/hotels?search=${encodeURIComponent(search)}`);};
    return (
        <Container sx={{mt: 5}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Typography variant='h4'>
                    Trending Destinations
                </Typography>
                <Typography variant='h6'>
                    Find your suitable Place to visit
                </Typography>
            </Box>
            <Container sx={{mt:2}}>
                <Grid container spacing={4}>
                    {cities.map((city,index)=>(
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card 
                                sx={{
                                    position:'relative', 
                                    height:250,
                                    '&:hover': {
                                        boxShadow: 6, 
                                        transform: 'scale(1.05)', 
                                        transition: 'transform 0.3s ease-in-out', 
                                    }
                                }}
                                onClick={()=>handleSearch(city.name)}
                            >
                                <CardMedia component='img' height='250' image={city.image} alt={city}/>
                                <Box 
                                    sx={{position: 'absolute', top:0, left:0, backgroundColor:'rgba(0,0,0,0.5)', color:'#fff', px:2, py:1, borderBottomRightRadius:10}}
                                >
                                <Typography variant='h6' fontWeight="semibold">{city.name}</Typography>
                                </Box>
                            </Card>
                        </Grid> 
                    ))}
                </Grid>
            </Container>
        </Container>
    )
}
