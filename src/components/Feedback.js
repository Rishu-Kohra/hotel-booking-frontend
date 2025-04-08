import React, { useEffect, useState } from 'react';
import { Card,Box,Container,Stack, CardContent, Typography, Grid, Button, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Feed, Reorder } from '@mui/icons-material';
import { userProfile } from '../services/api'
import Profileicon from './Profileicon'
import Slider from 'react-slick'
const Feedback = () => {
    const itemsPerSlide = 3;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedBackList, setFeedbackList] = useState([]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.ceil(feedBackList.length / itemsPerSlide) - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === Math.ceil(feedBackList.length / itemsPerSlide) - 1 ? 0 : prevIndex + 1));
    };

    const visibleFeedback = feedBackList.slice(
        currentIndex*itemsPerSlide,
        currentIndex*itemsPerSlide + itemsPerSlide
    )

    const fetchFeedBacks = async () => {
        try {
            const response = await userProfile.getFeedback();
            console.log(response.data)
            setFeedbackList(response.data);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    }

    useEffect(()=>{
        fetchFeedBacks();
    },[])

    return (
        <Box>
            <Typography variant='h4' sx={{ textAlign: 'center', margin:'20px'}}>Customer Feedbacks</Typography>
            <Container maxWidth="md">
                {feedBackList?.length > 0 ? (
                    <Grid>

                    <div style={{display:'flex', flexDirection:'row',gap: '20px'}}>
                        
                        {visibleFeedback.map((feedback, i) => (

                            <Card elevation={3} sx={{ height: "100%", px: 2, py: 3 }} key={i} >
                                <CardContent>
                                    <Box display={'flex'} alignItems={'center'} gap={2}>
                                        <Profileicon name={feedback.customerName} width={50} height={50} fontSize={24} />
                                        <Typography variant="subtitle2">
                                            {feedback.customerName}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" mb={3} mt={2}>
                                        {feedback.description}
                                    </Typography>
                                </CardContent>
                            </Card>

                        ))}
                        
                    </div>
                    <Stack direction="row" justifyContent="center" spacing={2} mt={4}>
                        <Button variant='outlined' onClick={handlePrev}>
                            <ArrowBackIos/>
                        </Button>
                        <Button variant='outlined' onClick={handleNext}>
                            <ArrowForwardIos/>
                        </Button>
                    </Stack>
                    </Grid>
                    
                ):(
                    <Typography variant='h6' color={'gray'}>No Feedbacks yet!!!</Typography>
                )}
                
            </Container>
        </Box>
    );
};

export default Feedback;