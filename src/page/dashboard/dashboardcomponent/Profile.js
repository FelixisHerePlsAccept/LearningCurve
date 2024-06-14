import { Breadcrumbs, Container, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { ROOT_DASHBOARD } from '../../../routes/route'
import { Helmet } from 'react-helmet-async'

export default function Profile() {

    return (
        <>
            <Helmet>
                <title>Profile</title>
            </Helmet>
            <Breadcrumbs separator=' | '>
                <Link to={`${ROOT_DASHBOARD}/mainpage/dashboard`} style={{textDecoration:'none', color:'black'}}>
                    <Typography variant='inherit'>
                        Dashboard
                    </Typography>
                </Link>
            <Typography variant='inherit'>
                Profile
            </Typography>
            </Breadcrumbs>
            <Container sx={{pt:'1rem'}}>
                <Typography>
                    Profile here...
                </Typography>
            </Container>
        </>
    )
}
