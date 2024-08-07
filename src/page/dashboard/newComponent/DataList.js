import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Container, Stack, Typography} from '@mui/material'
import DataTable from './DataTable'

export default function DataList() {

    return (
        <>
        <Helmet>
            <title>Your Bookmark</title>
        </Helmet>
        <Container maxWidth={'lg'}>
            <Stack>
                <Typography variant='h6' sx={{fontWeight:'bold'}}>Twitter Artist</Typography>
                <Stack direction='row' spacing={2}>
                    <Typography variant='subtitle2'>Just One Rule:</Typography>
                    <Typography variant='subtitle2' sx={{color:'red', fontWeight:'bolder'}}>NO AI ART/ARTIST !!!</Typography>
                </Stack>
                <DataTable  />
            </Stack>
        </Container>
        </>
    )
}
