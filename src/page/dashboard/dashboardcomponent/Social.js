import { Breadcrumbs, Container, Typography } from '@mui/material'
import React from 'react'
import { ROOT_DASHBOARD } from '../../../routes/route'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Social(){
  return (
    <>
      <Helmet>
        <title>Socials</title>
      </Helmet>
      <Breadcrumbs separator=' | '>
        <Link to={`${ROOT_DASHBOARD}/mainpage/dashboard`} style={{textDecoration:'none', color:'Black'}}>
          <Typography variant='inherit'>
            Dashboard
          </Typography>
        </Link>
        <Typography>
          Social Media
        </Typography>
      </Breadcrumbs>
      <Container sx={{pt:'1rem'}}>
        <Typography>
          Social media goes here...
        </Typography>
      </Container>
    </>
  )
}

