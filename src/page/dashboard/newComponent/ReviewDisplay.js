import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import moment from 'moment'
import { LoadingButton } from '@mui/lab'
import DataContext from '../../../Provider/DataProvider/DataProvider'

ReviewDisplay.propTypes = {
    dataPassed: PropTypes.object,
    requestType: PropTypes.string,
    onClose: PropTypes.func,
}

export default function ReviewDisplay({ dataPassed, requestType, onClose }) {

    const [isLoading, setIsLoading] = useState(false)

    const { dataRetrieved } = useContext(DataContext)

    console.log(dataRetrieved)

    const dataUpdate = dataRetrieved?.filter(data => data.docId === dataPassed?.docId)

    console.log('dataPassed', dataPassed)

    console.log('dataUpdate', dataUpdate)

    const checkForChanges = (dataPassed, dataUpdate) => {
        if (!dataUpdate || dataUpdate.length === 0) {
            console.log("No matching document found in dataUpdate.");
            return;
        }
    
        const originalData = dataUpdate[0]; // Assuming dataUpdate contains only one matching document
    
        const changes = {};
        for (const key in dataPassed) {
            if (dataPassed.hasOwnProperty(key) && originalData.hasOwnProperty(key)) {
                if (dataPassed[key] !== originalData[key]) {
                    changes[key] = {
                        original: originalData[key],
                        updated: dataPassed[key]
                    };
                }
            }
        }
    
        if (Object.keys(changes).length > 0) {
            return (
                <Alert severity="warning">
                    <Typography variant="body1">
                        Changes detected:
                        <ul>
                            {Object.entries(changes).map(([key, value]) => (
                                <li key={key}>
                                    {key}: {value.original} to {value.updated}
                                </li>
                            ))}
                        </ul>
                    </Typography>
                </Alert>
            )    
        } else {
            console.log("No changes detected.");
        }
    };
    
    // Example usage
    checkForChanges(dataPassed, dataUpdate);
    

    const acceptEntry = async () => {
        setIsLoading(true)
        try {
            const docRef = doc(db, "MYBOOKMARKS", dataPassed?.docId)
            await setDoc(docRef, {
                userName: dataPassed?.userName || "-",
                userPicUrl: dataPassed?.userPicUrl || "-",
                reftype: dataPassed?.reftype || "-",
                userTag: dataPassed?.userTag || "-",
                websiteUrl: dataPassed?.websiteUrl || "-",
                charOrigin: dataPassed?.charOrigin || "-",
                remark: dataPassed?.remark || "-",
                createdDate: moment(dataPassed?.createdDate).format('YYYY-MM-DD hh:mm:ss A'),
            })
            await deleteDoc(doc(db, "RequestCreate", dataPassed?.docId))
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            alert('Failure in Try Catch')
        }
    }
    const acceptUpdate = async () => {
        setIsLoading(true)
        try {
            const docRef = doc(db, "MYBOOKMARKS", dataPassed?.docId)
            await setDoc(docRef, {
                userName: dataPassed?.userName || "-",
                userPicUrl: dataPassed?.userPicUrl || "-",
                reftype: dataPassed?.reftype || "-",
                userTag: dataPassed?.userTag || "-",
                websiteUrl: dataPassed?.websiteUrl || "-",
                charOrigin: dataPassed?.charOrigin || "-",
                remark: dataPassed?.remark || "-",
                createdDate: dataUpdate?.createdDate || "-"
            })
            await deleteDoc(doc(db, "RequestedChange", dataPassed?.docId))
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            alert('Failure in Try Catch')
        }
    }
    const acceptDelete = async () => {
        setIsLoading(true)
        try {
            const docRef = doc(db, "MYBOOKMARKS", dataPassed?.docId)
            await deleteDoc(docRef)    
            await deleteDoc(doc(db, "RequestedDelete", dataPassed?.docId))
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            alert('Failure in Try Catch')
        }
    }
    const rejectUpdate = async () => {
        try {
            await deleteDoc(doc(db, "RequestedChange", dataPassed?.docId))
            onClose()
        } catch (error) {
            console.log(error)
            alert('Failure in Try Catch')
        }
    }
    const rejectEntry = async () => {
        try {
            await deleteDoc(doc(db, "RequestCreate", dataPassed?.docId))
            onClose()
        } catch (error) {
            console.log(error)
            alert('Failure in Try Catch')
        }
    }
    const rejectDelete = async () => {
        try {
            await deleteDoc(doc(db, "RequestedDelete", dataPassed?.docId))
            onClose()
        } catch (error) {
            console.log(error)
            alert('Failure in Try Catch')
        }
    }

    if(requestType === 'Addition') {
        return (
            <Box sx={{
                width:'100%',
                height:'100%',
            }}>
                <Grid container sx={{p:'1rem', height:'100%'}} spacing={1}>
                    <Grid item xs={12} align='left'>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Requested By: {dataPassed?.requestedBy}
                        </Typography>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Request Date: {dataPassed?.createdDate}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={12} align='center'>
                        <Typography variant='h6' sx={{fontWeight:'bold', color:'grey'}}>
                            Image Preview
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <img 
                            src={dataPassed?.userPicUrl} 
                            alt="" 
                            style={{
                                width:'10rem', 
                                height:'10rem', 
                                borderRadius:'50%' 
                            }} 
                        />
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <Typography variant='h6' sx={{fontWeight:'bold', color:'grey'}}>
                            Data Information
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Name: {dataPassed?.userName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Website:<br/>{dataPassed?.websiteUrl}
                        </Typography>
                    </Grid>
                    <Divider sx={{width:'100%'}} />
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Reference Type: {dataPassed?.reftype}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Tag: {dataPassed?.userTag}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} align='left'>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Remark: <br/>{dataPassed?.remark}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} align='right'>
                        <Stack direction='row' spacing={2} justifyContent={'flex-end'} alignItems={'flex-end'} sx={{width:'100%'}} >
                            <LoadingButton variant='contained' onClick={acceptEntry} sx={{bgcolor:'blue'}} loading={isLoading}>
                                Accept
                            </LoadingButton>
                            <Button onClick={rejectEntry}>
                                Reject
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        )
    }
    if(requestType === 'Update') {
        return (
            <Box sx={{
                width:'100%',
                height:'100%',
            }}>
                {checkForChanges(dataPassed, dataUpdate)}
                <Grid container sx={{p:'1rem', height:'100%'}} spacing={1}>
                    <Grid item xs={12} align='left'>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Requested By: {dataPassed?.requestedBy}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={12} align='center'>
                        <Typography variant='h6' sx={{fontWeight:'bold', color:'grey'}}>
                            Image Preview
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <img 
                            src={dataPassed?.userPicUrl} 
                            alt="" 
                            style={{
                                width:'10rem', 
                                height:'10rem', 
                                borderRadius:'50%' 
                            }} 
                        />
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <Typography variant='h6' sx={{fontWeight:'bold', color:'grey'}}>
                            Data Information
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Name: {dataPassed?.userName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Website:<br/>{dataPassed?.websiteUrl}
                        </Typography>
                    </Grid>
                    <Divider sx={{width:'100%'}} />
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Reference Type: {dataPassed?.reftype}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Tag: {dataPassed?.userTag}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Remark: <br/>{dataPassed?.remark}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Origin: <br/>{dataPassed?.charOrigin}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} align='right'>
                        <Stack direction='row' spacing={2} justifyContent={'flex-end'} alignItems={'flex-end'} sx={{width:'100%'}} >
                            <LoadingButton variant='contained' onClick={acceptUpdate} sx={{bgcolor:'blue'}} loading={isLoading}>
                                Accept
                            </LoadingButton>
                            <Button onClick={rejectUpdate}>
                                Reject
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        )
    }
    if(requestType === 'Remove') {
        return (
            <Box sx={{
                width:'100%',
                height:'100%',
            }}>
                {checkForChanges(dataPassed, dataUpdate)}
                <Grid container sx={{p:'1rem', height:'100%'}} spacing={1}>
                    <Grid item xs={12} align='left'>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Requested By: {dataPassed?.requestedBy}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align='left'>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Reason for Deletion: {dataPassed?.reasonForDeletion}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={12} align='center'>
                        <Typography variant='h6' sx={{fontWeight:'bold', color:'grey'}}>
                            Image Preview
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <img 
                            src={dataPassed?.userPicUrl} 
                            alt="" 
                            style={{
                                width:'10rem', 
                                height:'10rem', 
                                borderRadius:'50%' 
                            }} 
                        />
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <Typography variant='h6' sx={{fontWeight:'bold', color:'grey'}}>
                            Data Information
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Name: {dataPassed?.userName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Website:<br/>{dataPassed?.websiteUrl}
                        </Typography>
                    </Grid>
                    <Divider sx={{width:'100%'}} />
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Reference Type: {dataPassed?.reftype}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Tag: {dataPassed?.userTag}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Remark: <br/>{dataPassed?.remark}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='subtitle1' sx={{fontWeight:'bold', color:'grey'}}>
                            Origin: <br/>{dataPassed?.charOrigin}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align='center'>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} align='right'>
                        <Stack direction='row' spacing={2} justifyContent={'flex-end'} alignItems={'flex-end'} sx={{width:'100%'}} >
                            <LoadingButton variant='contained' onClick={acceptDelete} sx={{bgcolor:'blue'}} loading={isLoading}>
                                Accept
                            </LoadingButton>
                            <Button onClick={rejectDelete}>
                                Reject
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}
