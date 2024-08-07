import React, { useContext, useState } from 'react'
import DataContext from '../../../Provider/DataProvider/DataProvider'
import AuthContext from '../../../Provider/AuthProvider/AuthGuard'
import { Box, Button, Container, Dialog, DialogContent, Divider, Grid, Stack, Typography } from '@mui/material'
import ReviewDisplay from './ReviewDisplay'

export default function Notification() {

    const { currentUser } = useContext(AuthContext)
    const { notifyAdd, notifyRemove, notifyUpdate } = useContext(DataContext)

    

    const [dialogOpen, setDialogOpen] = useState(false)
    const [requestType, setRequestType] = useState(null)
    const [dataPassed, setDataPassed] = useState([])

    console.log('currentUser', currentUser)

    const FilteredAdd = notifyAdd?.filter(data => data.docId !== 'null')
    const FilteredRemove = notifyRemove?.filter(data => data.docId !== 'null')
    const FilteredUpdate = notifyUpdate?.filter(data => data.docId !== 'null')
    const TOTAL_NOTIFICATION = FilteredAdd?.length + FilteredRemove?.length + FilteredUpdate?.length || 0

    console.log('notifyAdd', FilteredAdd)
    console.log('notifyRemove', FilteredRemove)
    console.log('notifyUpdate', FilteredUpdate)
    console.log('TOTAL_NOTIFICATION', TOTAL_NOTIFICATION)

    const handleDialogClose = () => {
        setDataPassed([])
        setDialogOpen(false)
        setRequestType(null)
    }

    const handleReviewAdd  = (reviewData) => {
        setDataPassed(reviewData)
        setDialogOpen(true)
        setRequestType('Addition')
    
    }
    const handleReviewUpdate  = (reviewData) => {
        setDataPassed(reviewData)
        setDialogOpen(true)
        setRequestType('Update')
    }
    const handleReviewRemove  = (reviewData) => {
        setDataPassed(reviewData)
        setDialogOpen(true)
        setRequestType('Remove')
    }

    console.log(dataPassed)

    if(currentUser?.userRole === 'Admin') {
            return (
                <>
                    <Dialog open={dialogOpen} onClose={handleDialogClose} PaperProps={{sx:{width:'80vw', height:'80vh'}}}>
                        <DialogContent>
                            <ReviewDisplay dataPassed={dataPassed} requestType={requestType} onClose={handleDialogClose} />
                        </DialogContent>
                    </Dialog>
                    <Container maxWidth={'lg'}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box sx={{width:'100%', height:'auto', bgcolor:''}}>
                                    <Stack spacing={1}>
                                        <Typography variant='h6' sx={{fontWeight:'bold', color:'grey'}}>
                                            Notification for Addition
                                        </Typography>
                                        <Divider sx={{width:'100%'}} />
                                        <Stack direcion='column' spacing={2} alignItems={'center'}>
                                            {FilteredAdd && FilteredAdd.length > 0 ? FilteredAdd.map((data, index) => (
                                                <Box key={index} sx={{width:'80%', height:'auto', bgcolor:'', p:'0 1rem 0 1rem', borderRadius: '1rem', border:'1px solid gray'}}>
                                                    <Stack direction='row' spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                                                        {data.userName}
                                                        <Button onClick={()=>handleReviewAdd(data)}>
                                                            Review
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            ))
                                            : 
                                                <Typography variant='h6' color={'inherit'}>
                                                    No Request for Addition
                                                </Typography>
                                            }
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{width:'100%', height:'auto', bgcolor:''}}>
                                    <Stack spacing={1}>
                                        <Typography variant='h6' sx={{fontWeight:'bold', color:'grey'}}>
                                            Notification for Update
                                        </Typography>
                                        <Divider sx={{width:'100%'}} />
                                        <Stack direcion='column' spacing={2} alignItems={'center'}>
                                            {FilteredUpdate && FilteredUpdate.length > 0 ? FilteredUpdate.map((data, index) => (
                                                <Box key={index} sx={{width:'80%', height:'auto', bgcolor:'', p:'0 1rem 0 1rem', borderRadius: '1rem', border:'1px solid gray'}}>
                                                    <Stack direction='row' spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                                                        {data.userName}
                                                        <Button onClick={()=>handleReviewUpdate(data)}>
                                                            Review
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            ))
                                            : 
                                                <Typography variant='h6' color={'inherit'}>
                                                    No Request for Addition
                                                </Typography>
                                            }
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{width:'100%', height:'auto', bgcolor:''}}>
                                    <Stack spacing={1}>
                                        <Typography variant='h6' sx={{fontWeight:'bold', color:'grey'}}>
                                            Notification for Delete
                                        </Typography>
                                        <Divider sx={{width:'100%'}} />
                                        <Stack direcion='column' spacing={2} alignItems={'center'}>
                                            {FilteredRemove && FilteredRemove.length > 0 ? FilteredRemove.map((data, index) => (
                                                <Box key={index} sx={{width:'80%', height:'auto', bgcolor:'', p:'0 1rem 0 1rem', borderRadius: '1rem', border:'1px solid gray'}}>
                                                    <Stack direction='row' spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                                                        {data.userName}
                                                        <Button onClick={()=>handleReviewRemove(data)}>
                                                            Review
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            ))
                                            : 
                                                <Typography variant='h6' color={'inherit'}>
                                                    No Request for Addition
                                                </Typography>
                                            }
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </>
            )
        }

    return (
        <>
        </>
    )
}
