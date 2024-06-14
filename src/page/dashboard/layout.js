import { Box, Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROOT_DASHBOARD } from '../../routes/route';
import { ChevronDoubleRightIcon } from '@heroicons/react/outline';

export default function MainLayout() {

    const DashboardLink = ({to, children}) => {
        return <NavItem to={to} name={children} />
    }

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`${ROOT_DASHBOARD}`);
    }

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={2}>
                    <Box sx={{p:'2rem', height:'92.7vh',borderRight:'1px solid black', overflowY:'auto'}}>
                        <Stack direction='column' spacing={4}>
                            <Paper elevation={0} sx={{p:'0 1rem 1rem 1rem'}}>
                                <Typography sx={{cursor:'default'}}>
                                    USER: <br/> <strong>Felix Othneal Anak Frank</strong>
                                </Typography>
                            </Paper>
                            <Divider />
                            {/* Nav List Item should go here */}
                            <DashboardLink to='dashboard'>Dashboard</DashboardLink>
                            <DashboardLink to='profile'>Profile</DashboardLink>
                            <DashboardLink to='drawingport'>Drawing Portfolio</DashboardLink>
                            <DashboardLink to='social'>Socials</DashboardLink>
                            <DashboardLink to="randomizer">Randomizer</DashboardLink>
                            <Divider />
                            <Button type="button" variant='outlined' onClick={handleRedirect} sx={{borderRadius:'1rem'}}>
                                Return to main menu
                            </Button>
                        </Stack>
                    </Box>
                </Grid>
                <Grid item xs={12} md={10}>
                    <Box sx={{p:'2rem',height:'inherit',overflowY:'auto'}}>
                        <Outlet />
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

function NavItem ({to,name}) {

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
                        bgcolor: to === 'dashboard' ? 'skyblue' : to === 'profile' ? 'red' : to === 'drawingport' ? 'yellow' : to === 'social' ? 'paleturquoise' : to === 'randomizer' ? 'purple' : null,
                        borderRadius: '1rem',
                        p:'1rem 1rem 1rem 1rem',
                        width: isActive ? '120%' : '80%',
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
                            <ChevronDoubleRightIcon style={{ position:'relative',left: 10, margin:'auto', width: 20 }} />
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