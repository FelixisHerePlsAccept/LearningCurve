import { Box, Button, Card, Stack, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PATH_MAIN } from '../../routes/paths';

export default function Welcome() {

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(PATH_MAIN.datalist);
    }

    return (
        <>
            <Card sx={{position:'relative',width:'40%',margin:'auto',top:'10rem', borderRadius:'10rem'}}>
                <Box sx={{height:'60vh', textAlign:'center'}}>
                    <Stack direction="column"> 
                        <Stack justifyContent={'center'} spacing={3} sx={{p:'1rem 0 0 0'}}>
                            <Typography variant='h3'>
                                WELCOME
                            </Typography>
                            <Typography variant='h4'>
                                TO
                            </Typography>
                            <Typography variant='h3' fontWeight={500} fontFamily={'Comic Sans'}>
                                PORTFOLIO HAVEN
                            </Typography>
                        </Stack>
                        <Button variant='contained' onClick={handleRedirect} sx={{ top:'10vh', width:'fit-content', height:'5rem', margin:'auto'}}>
                            Proceed to Dashboard
                        </Button>
                    </Stack>
                </Box>
            </Card>
        </>
    )
}
