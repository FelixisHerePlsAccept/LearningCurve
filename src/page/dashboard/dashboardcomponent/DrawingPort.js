import { Box, Breadcrumbs, Container, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { ROOT_DASHBOARD } from '../../../routes/route'
import { Helmet } from 'react-helmet-async'

export default function DrawingPort() {

  return (
  <>
    <Helmet>
      <title>Drawing Portfolio</title>
    </Helmet>
    <Breadcrumbs separator=' | '>
      <Link to={`${ROOT_DASHBOARD}/mainpage/dashboard`} style={{textDecoration:'none', color:'black'}}>
        <Typography variant='inherit'>
          Dashboard
        </Typography>
      </Link>
      <Typography variant='inherit'>
        DrawingPort
      </Typography>
    </Breadcrumbs>
    <Container sx={{pt:'1rem'}}>
      <Box>
        <Typography>
          Drawing here...
        </Typography>
      </Box>
    </Container>
  </>
  )
}