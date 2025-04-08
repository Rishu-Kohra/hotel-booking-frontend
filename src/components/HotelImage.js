import React,{useEffect, useState} from 'react'
import { images } from '../services/api';
import { responsiveFontSizes } from '@mui/material';

export default function HotelImage({hotelId}) {
    const [image, setImage] = useState('');
    const [error, setError] = useState('');
    const fetchImages = async() => {
        try {
            const imageList = await images.getImage(hotelId);
            setImage(imageList.data)
            console.log(imageList)
        } catch(err) {
            console.log("error")
            setError("Image can't be fetched")
        }
    }
    useEffect(()=>{
        fetchImages();
    },[hotelId])
    return <img src={image[0]} alt="Hotel" height={250} width={'100%'}/>;
}