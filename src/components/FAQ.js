import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import {Typography, Box} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Container } from '@mui/material';

function FAQ() {
    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: '40px', gap:'2' }}>
                <Typography variant='h4' sx={{ textAlign: 'center', marginRight: '20px' }}>FAQ</Typography>
                <Typography variant='h6' sx={{ textAlign: 'center' }}>(Frequently Asked Questions)</Typography>
            </Box>
            <Container >
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                       
                    >
                        <Typography component="span"  variant='h6' sx={{fontWeight:'bold'}}>How to make a booking on InstaStay?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        To book on InstaStay, simply enter your check-in and check-out dates along with the city you want to stay in, and hit search. You'll get a list of available hotels. Choose your preferred hotel and room type based on amenities, ratings, and price. In the booking form, fill in your check-in and check-out dates, and the number of rooms you want to book. Finally, complete your booking. Happy travels!
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography component="span" variant='h6' sx={{fontWeight:'bold'}}>How to cancel a booking on InstaStay?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        To cancel a booking on InstaStay, go to "My Bookings" in the navbar. You'll see your past, active, and future bookings. You can only cancel a future booking. Find the booking you want to cancel and click the "Cancel Booking" button on that booking card. Your booking will be cancelled.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
               
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography component="span" variant='h6' sx={{fontWeight:'bold'}}>How to register yourself as an owner on InstaStay?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        To register as an owner on InstaStay, go to "Register" in the navbar. You'll see two options: customer or owner. Choose "Owner," fill in the required details, and click "Register."
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography component="span" variant='h6' sx={{fontWeight:'bold'}}>Why to choose us? </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                        Choose InstaStay for affordable prices, hassle-free booking and cancellation, and the ability to view past, active, and future bookings. Owners can easily manage their hotels, add hotels and room types, maintain inventory, and track customer bookings. Experience convenience and efficiency with InstaStay!
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Container>
        </Box>
    );
 
}
export default FAQ;