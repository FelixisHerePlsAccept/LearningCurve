import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Box, Button, Container, Dialog, DialogActions, DialogContent, Divider, Grid, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { DocumentMagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/solid'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../../firebase'
import DataContext from '../../../Provider/DataProvider/DataProvider'
import AuthContext from '../../../Provider/AuthProvider/AuthGuard'
import ReviewDisplay from './ReviewDisplay'
import TableNoData from '../../../component/table/TableNoData'
import { PATH_MAIN } from '../../../routes/paths'


export default function Notification() {

    const navigate = useNavigate()

    const { currentUser } = useContext(AuthContext)
    const { notifyAdd, notifyRemove, notifyUpdate, requestStatus, dataRetrieved } = useContext(DataContext)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [requestType, setRequestType] = useState(null)
    const [dataPassed, setDataPassed] = useState([])
    const [selected, setSelected] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [latestEntry, setLatestEntry] = useState(null)

    console.log( 'requestStatus', requestStatus )
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
    const Status_Check = requestStatus?.filter((notify) => notify?.requestedBy === currentUser?.userName)
    // const Request_Create = notifyAdd?.filter((notify) => notify?.requestedBy === currentUser?.userName)
    // const Request_Delete = notifyRemove?.filter((notify) => notify?.requestedBy === currentUser?.userName)

    // console.log('Request_Update', Request_Update)

    const handleRemove = (id) => {
        setSelected(id)
        setShowAlert(true)
        console.log('id', id)
    }

    const handleRemoveComplete = async () => {
        console.log('selected', selected)
        try {
            const docRef = doc(db, "NotificationStatus", selected);
            await deleteDoc(docRef)
            console.log(`Document ${selected} has been deleted`)
        } catch (error) {
            console.log('Failure in Try Catch', error)
        }
        setShowAlert(false)
    }

    const handleRejectRequest = async () => {
        let status
        status = (Status_Check?.filter((data) => data?.docId === selected))[0].notifyType
        console.log('dataRejected', status)
        switch(status) {
            case 'create':
                status = 'RequestCreate'
                break
            case 'update':
                status = 'RequestedChange'
                break
            case 'delete':
                status = 'RequestedDelete'
                break
            default:
                status = 'rejected'
                break
        }

        console.log(status)

        try {
            const docRef = doc(db, "NotificationStatus", selected);
            await deleteDoc(doc(db, `${status}`, selected));
            await deleteDoc(docRef)
            setShowDialog(false)
        } catch (error) {
            console.log('Failure in Try Catch', error)
        }
        
    }

    useEffect(() => {
        const tenDaysAgo = moment().subtract(3, 'days');

        const Retrieved = dataRetrieved?.filter((data) => moment(data?.createdDate).isAfter(tenDaysAgo) && data?.docId !== 'null');

        console.log(Retrieved);

        setLatestEntry(Retrieved)
    }, [dataRetrieved])

    const handleDateShowcase = () => {
        const ReturnThis = moment(new Date()).subtract(3, 'days').format('DD MMMM YYYY')
        return ReturnThis;
    }

    const handleNavigate = (username) => {
        navigate(PATH_MAIN.datalist, { state: { search: true, userSearch: username } });
    };

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
        <Container maxWidth={'lg'}>
            <Dialog open={showDialog} onClose={()=>setShowDialog(false)}>
                <DialogContent>
                    <Typography>
                        Are You Sure to Remove Your Request?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Stack direction='row' spacing={1}>
                        <Button onClick={()=>handleRejectRequest()}>
                            Confirm
                        </Button>
                        <Button onClick={()=>setShowDialog(false)}>
                            Cancel
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
            <Box sx={{p:'1rem'}}>
                <Typography variant='h5'>
                    User Request
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead sx={{bgcolor:'lightgray'}}>
                        <TableRow>
                            <TableCell>
                                <Typography>
                                    Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>
                                    Request Type
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>
                                    Status
                                </Typography>
                            </TableCell>
                            <TableCell />
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Status_Check && Status_Check.length > 0 ? Status_Check.map((data, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{borderLeft:'1px solid lightgray'}}>
                                    <Typography>
                                        {data?.userName}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{textTransform:'capitalize'}}>
                                        {data?.notifyType}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{textTransform:'capitalize'}}>
                                        {data?.status}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Button variant='contained' disabled={data?.status !== 'pending'} onClick={()=>{setShowDialog(true);setSelected(data?.docId)}}>
                                        Remove Request
                                    </Button>
                                </TableCell>
                                <TableCell sx={{borderRight:'1px solid ligthgray'}} align='center'>
                                    <Tooltip title='Delete This Notification'>
                                        <IconButton onClick={()=>handleRemove(data?.docId)} disabled={data?.status === 'pending'}>
                                            <TrashIcon style={{color: data?.status === 'pending' ? 'gray' :'red', width:'1.5rem', height:'1.5rem'}} />
                                        </IconButton>
                                        {showAlert && selected === data?.docId && 
                                            <Stack direction='row' spacing={1} justifyContent={'space-evenly'} sx={{p:'1rem'}}>
                                                <Button variant='contained' onClick={()=>handleRemoveComplete()} sx={{fontSize:10}}>
                                                    Delete<br/>Notification
                                                </Button>
                                                <Button variant='contained' onClick={()=>setShowAlert(false)}>
                                                    Cancel
                                                </Button>
                                            </Stack>
                                        }
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                        :
                        (
                            <TableNoData isNotFound={true} />
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <br/>
            <Box sx={{p:'1rem'}}>
                <Typography variant='h5'>
                    Latest Entry (3 Days Ago)
                </Typography>
            </Box>
            <TableContainer sx={{maxHeight:'36vh', overflow:'auto'}}>
                <Table>
                    <TableHead 
                        sx={{
                            position:'sticky',
                            top: '0',
                            bgcolor: 'lightgray',
                            zIndex: 1,
                        }}
                    >
                        <TableCell>
                            <Typography>
                                Name
                            </Typography>
                        </TableCell>
                        <TableCell />
                        <TableCell>
                            <Typography>
                                Reference Type
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                User Tag
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>
                                Date Added
                            </Typography>
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        {latestEntry && latestEntry.length > 0 ? latestEntry.map((data, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{borderLeft:'1px solid lightgray', width:300}}>
                                    <Stack direction='row' spacing={2} justifyContent={'space-between'} >
                                        <img src={data?.userPicUrl} alt='' style={{width:'50px', height:'50px', borderRadius:'50%'}} />
                                        <Stack direction='column' spacing={2} justifyContent={'flex-start'}>
                                            <Typography variant='subtitle2'>
                                                {data?.userName}
                                            </Typography>
                                            <Typography variant='caption'>
                                                {data?.remark === "-" || !data?.remark ? 'No remarks made' : data?.remark}
                                            </Typography>
                                        </Stack>
                                        <Tooltip title='Open in Data List Table'>
                                            <IconButton onClick={()=>handleNavigate(data?.userName)}>
                                                <DocumentMagnifyingGlassIcon style={{width:'1.5rem', height:'1.5rem'}} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                                <TableCell />
                                <TableCell>
                                    <Typography sx={{textTransform:'capitalize'}}>
                                        {data?.reftype}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box 
                                        sx={{
                                            display:'flex',
                                            justifyContent:'flex-start',
                                            alignItems:'center',
                                        }}
                                    >
                                        <Box 
                                            sx={{
                                                width:'5rem', 
                                                height:'auto', 
                                                bgcolor: data.userTag === 'NSFW' ? '#FFCCCB' : data.userTag === 'SFW' ? '#D1FFBD' : 'yellow' , 
                                                borderRadius:'2rem',
                                            }}
                                        >
                                            <Typography textAlign={'center'} fontFamily={'comic sans'} sx={{color: data.userTag === 'NSFW' ? 'red' : data.userTag === 'SFW' ? 'green' : '#bf9b30'}}>
                                                {data.userTag}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {moment(data?.createdDate).format('DD MMMM YYYY')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))
                        : 
                        (
                            <TableNoData isNotFound={true} />
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box 
                sx={{
                    height:'5vh',
                    width:'100%',
                    bgcolor:'lightgray',
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                }}
            >
                <Typography>
                    {latestEntry && latestEntry.length > 0 ? 
                    `Showing ${latestEntry.length} entries from ${handleDateShowcase()} `
                    : 
                    'No Entry'
                    }
                </Typography>
            </Box>
            
        </Container>
    )
}
