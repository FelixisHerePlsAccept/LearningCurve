import { Box, Button, Container, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROOT_DASHBOARD } from '../../routes/route';
import { ChevronDoubleRightIcon } from '@heroicons/react/outline';

export default function MainLayout() {

    const DashboardLink = ({to, children, sx}) => {
        return <NavItem to={to} name={children} sx={sx} />
    }

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`${ROOT_DASHBOARD}`);
    }

    return (
        // <Box sx={{position:'absolute', width:'100%', height:'auto'}}>
            <Container maxWidth={'xl'}>
                <Grid container>
                    <Grid item xs={12} md={2}>
                        <Box sx={{position:'sticky', top:0, height:'100vh', borderRight:'1px solid gray'}}>
                            <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', position:'sticky', top:0, bgcolor:'yellow', height:'10%'}}>
                                <Typography sx={{cursor:'default'}}>
                                    USER: <br/> <strong>Felix Othneal Anak Frank</strong>
                                </Typography>
                            </Box>
                            <Box sx={{bgcolor:'white',height:'80%', overflowY:'auto', overflowX:'hidden'}}>
                                <Stack direction='column' spacing={5}>
                                    <Box /> {/* For Spacing  */}
                                    <DashboardLink to='dashboard' sx={{bgcolor:'skyblue'}}>Dashboard</DashboardLink>
                                    <DashboardLink to='profile' sx={{bgcolor:'yellow'}}>Profile</DashboardLink>
                                    <DashboardLink to='drawingport' sx={{bgcolor:'blue'}}>Drawing Portfolio</DashboardLink>
                                    <DashboardLink to='social' sx={{bgcolor:'magenta'}}>Socials</DashboardLink>
                                    <DashboardLink to='randomizer' sx={{bgcolor:'rebeccapurple'}}>Randomizer</DashboardLink>
                                    <DashboardLink to='dbtesting' sx={{bgcolor:'orange'}}>DB Data</DashboardLink>
                                    <DashboardLink to='randomwithdb' sx={{bgcolor:'pink'}}>Randomizer + DB</DashboardLink>
                                </Stack>
                            </Box>
                            <Paper sx={{display:'flex', position:'sticky', bottom:0, height:'10%' , justifyContent:'center', alignItems:'center'}}>
                                <Button type="button" variant='contained' onClick={handleRedirect} sx={{borderRadius:'.5rem', bgcolor:'red'}}>
                                    Return to main menu
                                </Button>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Box sx={{p:'2rem',height:'inherit',overflowY:'auto'}}>
                            <Outlet />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        // </Box>
    )
}

function NavItem ({to,name, sx}) {

    const location = useLocation();
    const isActive = location.pathname === `${ROOT_DASHBOARD}/mainpage/${to}`;

    return (
        <>
            <NavLink 
                to={`${ROOT_DASHBOARD}/mainpage/${to}`}
                style={{ textDecoration:'none', textAlign:'left', color:'inherit'}}
            >
                <Box
                    sx={{
                        borderRadius: '1rem',
                        p:'1rem 1rem 1rem 1rem',
                        width: isActive ? '120%' : '80%',
                        ...sx,
                    }}
                >
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Typography noWrap={true} variant='inherit' sx={{fontWeight: isActive ? 700 : 500, height:20}}>
                                {name}
                            </Typography>
                        </Grid>
                        {isActive ? 
                        <Grid item xs={12} md={6} align='right' sx={{display:'flex'}}>
                            <ChevronDoubleRightIcon style={{ position:'relative', margin:'auto', width: 20 }} />
                        </Grid>
                        :
                        (
                            null
                        )}
                    </Grid>
                </Box>
            </NavLink>
        </>
    )
}