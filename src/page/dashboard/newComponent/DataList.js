import React, { useState } from 'react'
import NewEntry from './NewEntry'
import { Helmet } from 'react-helmet-async'
import { Accordion, AccordionDetails, AccordionSummary, Container, Grid, Stack, Typography } from '@mui/material'
import { PlusCircleIcon } from '@heroicons/react/outline'
import DataTable from './DataTable'

export default function DataList() {

    const [expanded, setExpanded] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    const handleCloseAccordian = () => {
        setExpanded(false)
    }

    return (
        <>
        <Helmet>
            <title>Your Bookmark</title>
        </Helmet>
        <Container maxWidth={'lg'}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant='h6' sx={{fontWeight:'bold'}}>Twitter Artist</Typography>
                    <Stack direction='row' spacing={2}>
                        <Typography variant='body1'>Just One Rule:</Typography>
                        <Typography variant='body1' sx={{color:'red', fontWeight:'bolder'}}>NO AI ART/ARTIST !!!</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Accordion expanded={expanded === 'newEntry'} onChange={handleChange('newEntry')} sx={{width:'100%'}}>
                        <AccordionSummary expandIcon={<div style={{width:'2rem', height:'2rem'}}><PlusCircleIcon /></div>}>
                            <Typography>
                                New Entry Form
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <NewEntry refresh={refresh} setRefresh={setRefresh} onSubmitClose={handleCloseAccordian} />
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={12}>
                    <DataTable refresh={refresh} />
                </Grid>
            </Grid>
        </Container>
        </>
    )
}
