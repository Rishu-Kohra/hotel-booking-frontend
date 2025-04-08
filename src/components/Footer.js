import React from "react";
import {Box, Typography} from '@mui/material';
export default function footer() {
    return (
        <Box
        component="footer"
        sx={{
            backgroundColor: '#000',
            color: '#fff',
            textAlign: 'center',
            py: 2,
            mt: 3,
        }}
    >
        <Typography variant="body2" display="block">
            &copy; 2025 InstaStay. All rights reserved.
        </Typography>
    </Box>
    )
}