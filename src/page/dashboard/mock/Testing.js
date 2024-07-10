import { Box, Container, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Testing() {

    const [arrayData, setArrayData] = useState([])

    const [listRef, setListRef] = useState([])

    const [testing, setTesting] = useState(null)

    const [file, setFile] = useState()

    const handleFile = (event) => {
        setFile(event.target.files[0])
    }

    console.log('file', file)

    const handleUpload = () => {
        const formdata = new FormData();
        formdata.append('image', file);
        axios.post('https://backend-r2i9.onrender.com/upload', formdata)
        .then()
        .catch(er => console.log(er))
    }

    useEffect(()=> {
        fetch('https://backend-r2i9.onrender.com/view')
        .then(res => res.json())
        .then(data=>{
            setArrayData(data)
        })
        .catch(err => console.error(err))
    },[])

    const dataFiltered = applyFilter ({
        inputData: arrayData,
        selectedRef: testing,
    })

    const winnerData = dataFiltered.map((data,index) => ({
        id: index + 1,
        option: data.data_name,
    }))

    // winnerData.forEach((item) => {
    //     console.log(item.id, item.option)
    // })

    // console.log('dataFiltered', dataFiltered) ;//the one holding the winnerData

    useEffect(()=> {
        fetch('https://backend-r2i9.onrender.com/reference')
        .then(res => res.json())
        .then(data=>{
            setListRef(data)
        })
        .catch(err => console.error(err))
    },[])

    const handleSelect = (event) => {
        setTesting(event.target.value)
    }

    return (
        <Box sx={{bgcolor:'black', position:'absolute', width:'100%', hieght:'auto'}}>
            <Container maxWidth={'xl'}>
            <Grid container>
                <Grid item xs={12} md={2}>
                    <Box sx={{position:'sticky', top:0, height:'100vh', bgcolor:'red'}}>
                        <Box sx={{position:'sticky', top:0, bgcolor:'yellow', height:'10%'}}>
                            <Typography>
                                Logo and Site Name
                            </Typography>
                        </Box>
                        <Box sx={{position:'sticky', top:0, bgcolor:'yellow', height:'10%'}}>
                            <Typography>
                                Account
                            </Typography>
                        </Box>
                        <Box sx={{bgcolor:'white',height:'80%', overflow:'auto'}}>
                        
                        </Box>
                        <Box sx={{position:'sticky', bottom:0, bgcolor:'yellow', height:'10%'}}>
                            <Typography>
                                Log Out
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={10}>
                    <Box sx={{bgcolor:'blue', height:'150vh', overflow:'auto'}} />
                </Grid>
            </Grid>
            </Container>
        </Box>
    )
}

function applyFilter ({inputData, selectedRef}) {
    if(selectedRef) {
        const newDataList = inputData.filter((selected) => selected.ref_id === selectedRef)
        return newDataList
    }
    return inputData;
}