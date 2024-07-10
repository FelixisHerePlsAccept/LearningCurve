import { Box, Breadcrumbs, Container, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROOT_DASHBOARD } from '../../../routes/route'
import { Helmet } from 'react-helmet-async'
import { ThemeProvider, useTheme } from '@mui/material/styles'

export default function DrawingPort() {

  const theme = useTheme();

  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <div>
      <ThemeProvider theme={theme}>
      {isLargeScreen ? (
        <p>This is a large screen or larger.</p>
      ) : (
        <p>This is a smaller screen.</p>
      )}
      </ThemeProvider>
    </div>
  );
}