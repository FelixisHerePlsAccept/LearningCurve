import { Box, Breadcrumbs, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import LoadingScreen from '../../../loading_screen/LoadingScreen'
import RefRandomizer from './RefRandomizer'
import { Helmet } from 'react-helmet-async'
import DataRandomizer from './DataRandomizer'
import xIcon from '../mock/x.png'
import './borderAnimate.css'

export default function RandomizerDb() {

    const [ref, setRef] = useState([]);
    const [winnerRef, setWinnerRef] = useState('');
    const [dbdata, setDBData] = useState([]);
    const [showFirstWheel, setShowFirstWheel] = useState(true);
    const [showSecondWheel, setShowSecondWheel] = useState(false);
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [winnerData, setWinnerData] = useState([]);
    const [warning, setWarning] = useState(false);

    useEffect (() => {
        fetch('https://backend-r2i9.onrender.com/reference')
        .then(res => res.json())
        .then(data => {
            setRef(data)
        })
        .catch(err => console.error(err))
        fetch('https://backend-r2i9.onrender.com/view')
        .then(res => res.json())
        .then(data => {
            setDBData(data)
        })
        .catch(err => console.error(err))
    }, [])

    const filteredRef = ref.filter(reflist => reflist.ref_name !== 'Random Image')

    const refArray = filteredRef.map((ref,i) => ({
        id: i + 1,
        option: ref.ref_name,
        rowid: ref.ref_id
    }))
    
    const dataFiltered = applyFilter ({
        inputData: dbdata,
        ref: winnerRef,
    })

    const winnerArray = dataFiltered.map((windata,i) => ({
        id: i + 1,
        option: windata?.data_name,
        rowid: windata?.data_rowid,
        url: windata?.data_url,
        origin: windata?.data_origin,
        data_tag:windata?.data_tag,
        image: windata?.data_imagename,
        ref_id: windata?.ref_id,
    }))

    const onFinishFirst = () => {
        setShowFirstWheel(false)
        setShowSecondWheel(true)
    }

    const onFinishSecond = () => {
        setShowSecondWheel(false)
        setRevealAnswer(true)
    }

    const handleResetAll = () => {
        setWinnerRef(null) //reset first wheel winner
        setWinnerData([]) //reset winner data
        setShowFirstWheel(true) // show first wheel again
        setShowSecondWheel(false) // hide second wheel
        setRevealAnswer(false) // reset winner display
    }

    const redoSecond = () => {
        setWinnerData([]);
        setShowSecondWheel(true)
        setRevealAnswer(false);
    }

    const handleRefSelect = (event) => {
        if(winnerArray) {
            setWinnerData([])
        }
        setWinnerRef(event.target.value)
        setShowFirstWheel(false)
        setShowSecondWheel(true)
    }

    const handleOpenWarning = () => {
        setWarning(true)
    }

    const handleCloseWarning = () => {
        setWarning(false)
    }

    const handleRedirect = () =>{
        window.open(`https://x.com/${winnerData.option}/media`, '_blank')
        handleCloseWarning();
    }

    console.log('dataFiltered', dataFiltered)
    console.log('DBDATA', dbdata)
    console.log('winnerRef', winnerRef)
    console.log('refArray', refArray)
    console.log('showFirstWheel', showFirstWheel)
    console.log('winnerArray', winnerArray)
    console.log('winnerData', winnerData)

    return (
        <>
        <Dialog open={warning} onClose={handleCloseWarning}>
            <DialogTitle>
                Confirm Redirect to {`${winnerData.option}`} ?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    The following account is labelled as <Typography sx={{color:winnerData.data_tag === 'NSFW' ? 'red' : 'gold'}}>{`${winnerData.data_tag}`}</Typography> <br/>
                    Do you wish to proceed?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRedirect} variant='contained'>
                    PROCEED
                </Button>
                <Button onClick={handleCloseWarning} variant='contained'>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
        <Helmet>
            <title>Randomizer</title>
        </Helmet>
        <Breadcrumbs separator= " | ">
            <Typography variant='inherit'>
                Dashboard
            </Typography>
            <Typography variant='inherit'>
                Randomizer
            </Typography>
        </Breadcrumbs>
        <Container maxWidth={'md'} sx={{p:'2rem'}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl sx={{width:'100%'}}>
                        <InputLabel>
                            Select Input
                        </InputLabel>
                        <Select
                            value={winnerRef}
                            onChange={handleRefSelect}
                            disabled={!!revealAnswer}
                        >
                            {filteredRef && filteredRef.map((ref) =>(
                                <MenuItem key={ref.ref_id} value={ref.ref_name}>
                                    {ref.ref_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {winnerRef ? (
                    <Grid item xs={12} md={6} align={'right'}>
                        <Box>
                            <Button variant='contained' onClick={handleResetAll}>
                                Reset Wheel
                            </Button>
                        </Box>
                    </Grid>
                ) : null}
                
                {revealAnswer ? (
                    <Grid item xs={12}>
                        <Box sx={{height:'60vh', width:'100%', border: '5px solid gold', borderRadius:'2rem', bgcolor:'rgb(220,220,220)'}}>
                            {revealAnswer ? (
                                <Grid container sx={{p:'1rem'}}>
                                    <Grid item xs={12} md={6} sx={{p:'1rem'}}>
                                        <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'50vh'}}>
                                            {winnerRef === 'Artist' || winnerRef === 'Model' || winnerRef === 'Anime' || winnerRef === 'Game Character' || winnerRef === 'Vtuber' || winnerRef === 'Youtube' ? (
                                                <Box sx={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'auto', height:'auto'}} >
                                                    <Box className="border_animate_colorful" sx={{ position:'absolute', top:-15, width:'21rem', height:'21rem',zIndex: 1}}/>
                                                    <img src={winnerData.url} alt={winnerData.option} style={{width:'20rem', height:'20rem', borderRadius:'50%', zIndex: 2}} />
                                                </Box>
                                            ):
                                            winnerRef === 'Random Image' ? (
                                                <Box sx={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:'auto', height:'auto'}} >
                                                    <Box className="border_animate_colorful" sx={{ position:'absolute', top:-15, width:'21rem', height:'21rem',zIndex: 1}}/>
                                                    <img src={`https://backend-r2i9.onrender.com/${winnerData.image}`} alt={winnerData.option} style={{width:'20rem', height:'20rem', borderRadius:'50%', zIndex: 2}}/>
                                                </Box>
                                            ): 
                                            null}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{p:'1rem'}}>
                                        <Box sx={{display:'flex', width:'100%', height:'50vh', justifyContent:'left', alignItems:'center'}}>
                                            <Stack direction={'column'} sx={{p:'1rem'}} spacing={5}>
                                                <Typography variant='h4'>
                                                    {winnerData.option}
                                                </Typography>
                                                <Typography>
                                                    {winnerRef === 'Artist' || winnerRef === 'Model'?
                                                    <Stack direction={'column'} spacing={2}>
                                                        <Typography>
                                                            From: Twitter/X
                                                        </Typography>
                                                        {winnerData.data_tag === 'NSFW' || winnerData.data_tag === 'Borderline'? (
                                                            <IconButton sx={{width:'fit-Content'}} onClick={handleOpenWarning}>
                                                                <img src={xIcon} alt='Twitter Icon' style={{width:'3rem', height:'3rem', borderRadius:'50%'}} />
                                                            </IconButton>
                                                        ): (
                                                            <a href={`https://x.com/${winnerData.option}/media`} target='_blank' rel='noopener noreferrer'>
                                                                <img src={xIcon} alt='Twitter Icon' style={{width:'3rem', height:'3rem', borderRadius:'50%'}} />
                                                            </a>
                                                        )}
                                                    </Stack>
                                                    : winnerRef === 'Pose Reference' ? (
                                                        <Stack direction="column">
                                                            <Typography>
                                                                From: Website
                                                            </Typography>
                                                            <a href={winnerData.url} target="_blank" rel='noopener noreferrer'>{winnerData.url}</a>
                                                        </Stack>
                                                    )
                                                    : winnerRef === 'Youtube' ?
                                                    'From: Youtube'
                                                    : winnerRef === 'Game Character' || winnerRef === 'Anime' || winnerRef === 'Vtuber' ?
                                                    winnerData.origin
                                                    :
                                                    null
                                                    }
                                                </Typography>
                                                <Button variant='contained' onClick={redoSecond}>
                                                    Redo Second Wheel
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                </Grid>
                            ) : (
                                null
                            )}
                        </Box>
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{height:'105%', width:'100%', borderRadius:'2rem', border:'2px solid black', p:'.5rem'}}>
                            {!showSecondWheel ? (
                                refArray.length > 0 && showFirstWheel ? (
                                    <RefRandomizer reflist = {refArray} setWinnerRef={setWinnerRef} onFinishSpin={onFinishFirst} />
                                ):
                                !revealAnswer ? <LoadingScreen /> : null
                            ) : (
                                <DataRandomizer passedData = {winnerArray} onFinishSpin={onFinishSecond} setWinnerData={setWinnerData}/>
                            )}
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Container>
        </>
    )
}

function applyFilter ({inputData, ref}) {
    if(ref){
        inputData = inputData.filter((name)=>{
            const filter1 = name.ref_name === ref;
            return filter1;
        })
    }
    return inputData
}