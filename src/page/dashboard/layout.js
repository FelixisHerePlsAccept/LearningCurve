import { Box, Button, Container, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PATH_MAIN } from '../../routes/paths';
import AuthContext from '../../Provider/AuthProvider/AuthGuard';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import DataContext from '../../Provider/DataProvider/DataProvider';

export default function MainLayout() {

    const { currentUser, dispatch } = useContext(AuthContext)
    const { notifyAdd, notifyRemove, notifyUpdate } = useContext(DataContext)

    const FilteredAdd = notifyAdd?.filter(data => data.docId !== 'null')
    const FilteredRemove = notifyRemove?.filter(data => data.docId !== 'null')
    const FilteredUpdate = notifyUpdate?.filter(data => data.docId !== 'null')
    const TOTAL_NOTIFICATION = FilteredAdd?.length + FilteredRemove?.length + FilteredUpdate?.length || 0

    const DashboardLink = ({to, children, sx}) => {
        return <NavItem to={to} name={children} sx={sx} />
    }

    const navigate = useNavigate();

    const handleRedirect = () => {
        try {
            signOut(auth)
            dispatch({type:'LOGOUT'})
        } catch(err) {
            console.error(err)
        }
        navigate(PATH_MAIN.welcome);
    }

    return (
        // <Box sx={{position:'absolute', width:'100%', height:'auto'}}>
            <Container maxWidth={'xl'}>
                <Grid container>
                    <Grid item xs={12} md={2}>
                        <Box sx={{position:'sticky', top:0, height:'100vh', borderRight:'1px solid gray'}}>
                            <Box sx={{display:'flex', justifyContent:'left', alignItems:'center', pl:'1rem', position:'sticky', top:0, bgcolor:'yellow', height:'10%'}}>
                                <Stack spacing={1}>
                                    <Typography variant='h5' sx={{cursor:'default'}}>
                                        USER: <strong>{currentUser.userName}</strong>
                                    </Typography>
                                    <Divider sx={{width:'100%', color:'gray'}} />
                                    <Typography variant='body1' sx={{cursor:'default'}}>
                                        Role: {currentUser?.userRole}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Box sx={{bgcolor:'white',height:'80%', overflowY:'auto', overflowX:'hidden'}}>
                                <Stack direction='column' spacing={5}>
                                    <Box /> 
                                    <DashboardLink to='datalist' sx={{bgcolor:'red'}}>Data List</DashboardLink>
                                    <DashboardLink to='testing' sx={{bgcolor:'red'}}>Testing</DashboardLink>
                                    <DashboardLink to='testing2' sx={{bgcolor:'red'}}>Testing2</DashboardLink>
                                    <DashboardLink to='notification' sx={{bgcolor:'yellow'}}>
                                        <Stack direction='row' spacing={1} alignItems={'center'}>
                                            <Typography variant='inherit'>
                                                Notification
                                            </Typography>
                                            { currentUser?.userRole === 'Admin' && TOTAL_NOTIFICATION > 0 && (
                                                <Box sx={{
                                                    borderRadius:'50%',
                                                    bgcolor:'red',
                                                    width:"1.5rem",
                                                    height:"1.5rem",
                                                    display:'flex',
                                                    justifyContent:'center',
                                                    alignItems:'center',
                                                }}>
                                                    <Typography variant='inherit' sx={{color:'white'}}>
                                                        {TOTAL_NOTIFICATION}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {/* Below here, include a counter for the number of notifications */}
                                        </Stack>
                                    </DashboardLink>
                                </Stack>
                            </Box>
                            <Paper sx={{display:'flex', position:'sticky', bottom:0, height:'10%' , justifyContent:'center', alignItems:'center'}}>
                                <Button type="button" variant='contained' onClick={handleRedirect} sx={{borderRadius:'.5rem', bgcolor:'red'}}>
                                    Log Out
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
    const isActive = location.pathname === `${PATH_MAIN.mainpage}/${to}`;

    return (
        <>
            <NavLink 
                // to={`${ROOT_DASHBOARD}/mainpage/${to}`}
                to={`${PATH_MAIN.mainpage}/${to}`}
                style={{ textDecoration:'none', textAlign:'left', color:'inherit'}}
            >
                <Box
                    sx={{
                        borderRadius: '1rem',
                        p:'1rem 1rem 1rem 1rem',
                        // width: isActive ? '100%' : '80%',
                        bgcolor: isActive ? 'gray' : 'inherit',
                    }}
                >
                    <Grid container>
                        <Grid item xs={12} md={6} >
                            <Typography noWrap={true} variant='inherit' sx={{fontWeight: isActive ? 700 : 500, color: isActive ? 'white' : 'inherit'}}>
                                {name}
                            </Typography>
                        </Grid>
                        {isActive ? 
                        <Grid item xs={12} md={6} align='right' sx={{display:'flex'}}>
                            <ChevronDoubleRightIcon style={{ position:'relative', margin:'auto', width: 20}} />
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