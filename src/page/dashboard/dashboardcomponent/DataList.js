import React, { useEffect, useState } from 'react'
import { TablePaginationCustom, useTable } from '../../../component/table'
import { Box, Button, Dialog, DialogContent, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Popover, Select, Snackbar, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from '@mui/material'
import { DotsVerticalIcon, PencilAltIcon, SearchCircleIcon, TrashIcon } from '@heroicons/react/outline'
import EditData from './EditData'

export default function DataList() {
    const [view, setView] = useState([])

    const [listRef, setListRef] = useState([])

    const [submit, setSubmit] = useState(false)

    const [open, setOpen] = useState(false)

    const [passingData, setPassingData] = useState([])

    const [filterName, setFilterName] = useState('')

    const [filterStatus, setFilterStatus] = useState('all')

    const [openPopover, setOpenPopover] = useState(null)

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [onSort, setOnSort] = useState('')

    const [refresh, setRefresh] = useState(false);

    const dataFiltered = applyfilter({
        inputData: view,
        filterStatus,
        filterName,
        onSort,
    })

    const {
        page,
        rowsPerPage,
        setPage,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable()

    const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    useEffect (() => {
        fetch('http://localhost:1000/view')
        .then(res => res.json())
        .then(data=> {
            setView(data);
        })
        .catch(err => console.error(err))
    },[submit, openSnackbar, refresh])

    useEffect (() => {
        fetch('http://localhost:1000/reference')
        .then(res => res.json())
        .then(data => {
            setListRef(data)
        })
        .catch(err => console.error(err))
    },[])

    const handleFilterStatus = (event, newValue) => {
        setPage(0)
        setFilterStatus(newValue)
    }

    const handleFilterName = (event) => {
        setPage(0);
        setFilterName(event.target.value)
    }

    const handleDelete = async (deleteName) => {
        try {
            const response = await fetch('http://localhost:1000/delete', {
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    rowid: deleteName
                })
            })
            if (response.ok) {
                console.log('Delete Success')
                setSubmit(false)
            }
            else{
                console.log('Deletion failed')
            }
        }
        catch (error) {
            console.error(error)
        }
        if (page > 0) {
            if (dataInPage.length < 2) {
              setPage(page - 1);
            }
          }
    }

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget)
    }

    console.log('openPopever', openPopover)

    const handleClosePopover = () => {
        setOpenPopover(null);
    }

    const handleEdit = () => {
        console.log('selected',passingData)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSelected = (data) => {
        setPassingData(data)
    }

    const handleOpenSnackbar = () => {
        setOpenSnackbar(true)
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
        setOpen(false)
    }

    const handleSelectSort = (event) => {
        setOnSort(event.target.value);
    }

    console.log('onSort', onSort)

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogContent>
                    <EditData passedData={passingData} onClose={handleClose} onUpdate={handleOpenSnackbar} />
                </DialogContent>
            </Dialog>
            <Snackbar
                ContentProps={{ sx: {background: 'white', color: 'green', fontWeight:'bold'}}}
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                message={`Data of ${passingData.data_name} has been updated`}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            />
            <Button onClick={()=>setRefresh((prev)=>!prev)}>
                Refresh
            </Button>
            <Tabs 
                value={filterStatus}
                onChange={handleFilterStatus}
                sx={{
                    borderTopLeftRadius:'1rem',
                    borderTopRightRadius:'1rem',
                    bgcolor:'gray'
                }}
            >
                <Tab label="All" value={'all'} />
                {listRef && listRef.map((tab, i) => (
                    <Tab key={i} label={tab.ref_name.length > 5 ? tab.ref_name.slice(0,5) + '...' : tab.ref_name} value={tab.ref_name} />
                ))}
            </Tabs>
            <Stack direction="row" sx={{p:'1rem'}} spacing={2}>
                <FormControl sx={{width:'30%'}}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                        value={onSort}
                        onChange={handleSelectSort}
                    >
                        <MenuItem value="Name">Name</MenuItem>
                        <MenuItem value="Date Created">Date Created</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    placeholder='Search...'
                    value={filterName}
                    onChange={handleFilterName}
                    variant='outlined'
                    InputProps={{
                        startAdornment : (
                            <InputAdornment position="start">
                                <SearchCircleIcon style={{width:'30px', height:'30px'}} />
                            </InputAdornment>
                        )
                    }}
                />
                {filterName || onSort ? <Button onClick={()=>{setFilterName('');setOnSort('')}}><TrashIcon style={{color:'red', width:'30px', height:'30px'}}/></Button> : null}
            </Stack>
            
            <TableContainer sx={{maxHeight:'57vh', overflow:'auto'}}>
            {/* <Box sx={{height:'57vh', overflow:'auto'}}> */}
                <Table>
                    <TableHead sx={{position:'sticky', top:0, zIndex:2, bgcolor:'grey'}}>
                        <TableRow>
                            <TableCell>Reference</TableCell>
                            <TableCell align='center'>Name</TableCell>
                            <TableCell>Origin</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataFiltered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((data, i) => (
                            <TableRow key={i}>
                                <TableCell>{data.ref_name}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={2} sx={{justifyContent:'left', alignItems:'center'}}>
                                        {data.ref_id !== 3 && data.ref_id !== 8 ? <img src={data.data_url} alt={data.data_name} style={{objectFit:'cover', width:'60px', height:'60px', borderRadius:'50%'}} /> : null }
                                        <Typography sx={{fontSize:20}}>
                                            
                                            {data.ref_id === 1 || data.ref_id === 2 ? (
                                                <a style={{textDecoration:'none'}} href={`https://x.com/${data.data_name}/media`} target="_blank" rel='noopener noreferrer'>{data.data_name}</a>
                                            )
                                            :
                                            data.ref_id === 7 ?
                                                <a style={{textDecoration:'none'}} href={`https://youtube.com/${data.data_name}/videos`} target="_blank" rel='noopener noreferrer'>{data.data_name}</a>
                                            : data.data_name
                                            }
                                            
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant='h6'>
                                        {data.data_origin === '' || data.data_origin === null ? <Typography>From: {data.ref_id === 1 ? 'Twitter/X' : data.ref_id === 2 ? 'Twitter/X' : data.ref_id === 7 ? 'Youtube' : 'Website'}</Typography> 
                                        : 
                                        <Typography>
                                            From: {data.data_origin}
                                        </Typography>
                                        }
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {new Date(data.data_dateCreated).toLocaleString()}
                                </TableCell>
                                <TableCell align='right'>
                                    <IconButton sx={{width:'fit-Content'}} onClick={(event)=>{handleSelected(data);handleOpenPopover(event)}}>
                                        <DotsVerticalIcon style={{height:'20px', width:'20px'}} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                        }
                    </TableBody>
                </Table>
                {/* </Box> */}
            </TableContainer>
            
            <TablePaginationCustom
                count={dataFiltered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
            />
            <Popover
                open={openPopover}
                anchorEl={openPopover}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical:'top',
                    horizontal:'left',
                }}
            >
                <MenuItem
                    onClick={()=>{
                        handleEdit(passingData);
                        handleClosePopover();
                    }}
                >
                    <PencilAltIcon style={{width:'20px', height:'20px', color: 'blue'}} />
                    Modify
                </MenuItem>
                <MenuItem
                    onClick={()=>{
                        handleDelete(passingData.data_rowid);
                        handleClosePopover();
                        setSubmit(true);
                    }}
                >
                    <TrashIcon style={{width:'20px', height:'20px', color:'red'}} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    )
}

function applyfilter ({ inputData, filterStatus, filterName, onSort }) {
    if (filterStatus !== 'all') {
        inputData = inputData.filter((data)=>data.ref_name === filterStatus)
    }
    if (filterName) {
        inputData = inputData.filter((name)=>{
            const nameMatch = name.data_name?.toLowerCase().includes(filterName.toLowerCase());
            const originMatch = name.data_origin?.toLowerCase().includes(filterName.toLowerCase());
            const refMatch = name.ref_name?.toLowerCase().includes(filterName.toLowerCase());
            return nameMatch || originMatch || refMatch;
        })
    }
    if (onSort === 'Name') {
        inputData.sort((a,b) => a.data_name.localeCompare(b.data_name))
    } else if (onSort === 'Date Created') {
        inputData.sort((a,b) => a.data_dateCreated.localeCompare(b.data_dateCreated))
    }
    else {
        inputData.sort((a,b) => a.data_rowid - b.data_rowid)
    }
    return inputData;
}