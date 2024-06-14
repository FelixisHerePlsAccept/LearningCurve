import { Box, Button, Card, Stack, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROOT_DASHBOARD } from '../../routes/route';

export default function Welcome() {

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`${ROOT_DASHBOARD}/mainpage/dashboard`);
    }

    return (
        <>
            <Card sx={{width:'40%',margin:'auto',marginTop:'5rem'}}>
                <Box sx={{height:'50vh', textAlign:'center',pt:'1rem'}}>
                    <Stack direction="column" >
                        <div style={{position:'relative', top:'5rem'}}>
                            <Typography variant='h3'>
                                Welcome
                            </Typography>
                            <Typography variant='h4'>
                                to <br/> My "CUSTOM" Linktree
                            </Typography>
                        </div>
                        <Button variant='contained' onClick={handleRedirect} sx={{ top:'20vh', width:'fit-content', height:'5rem', margin:'auto'}}>
                            Proceed to Dashboard
                        </Button>
                    </Stack>
                </Box>
            </Card>
        </>
    )
}
