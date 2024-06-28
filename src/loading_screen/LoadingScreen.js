import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './loadingscreen.css'

export default function LoadingScreen() {

    const [ loadingtext, setLoadingText ] = useState('Loading');

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText(prev => {
                const dotCount = (prev.match(/\./g) || []).length;
                if (dotCount === 3) return 'Loading';
                return prev + ' .';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);
    
    return (
        <>
            
            <Box className='container'>
                <Box className='box_animate_0deg' />
                <Box className='box_animate_45deg' />
                <Box sx={{bgcolor:'rgba(255,255,255)', borderRadius:'1rem',zIndex:1, border:'5px solid grey'}}>
                    <Typography variant='h3'>
                        {loadingtext}
                    </Typography>
                </Box>
            </Box>
        </>
    )
}
