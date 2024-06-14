import { Breadcrumbs, Container, Typography } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function Dashboard() {
  return (
    <>
        <Helmet>
            <title>Dashboard</title>
        </Helmet>
        <Breadcrumbs>
            <Typography variant='inherit'>
                Dashboard
            </Typography>
        </Breadcrumbs>
        <Container sx={{pt:'1rem'}}>
            <Typography>
                Dashboard component here...
            </Typography>
        </Container>
    </>
  )
}
