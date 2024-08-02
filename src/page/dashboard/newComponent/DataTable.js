import { collection, getDocs } from 'firebase/firestore'
import PropType from 'prop-types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Popover, Select, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import moment from 'moment'
import { DotsVerticalIcon, DownloadIcon, PencilAltIcon, SearchCircleIcon, TrashIcon } from '@heroicons/react/outline'
import { saveAs } from 'file-saver'
import { db } from '../../../firebase'
import { emptyRows, TableEmptyRows, TablePaginationCustom, useTable } from '../../../component/table'
import TableNoData from '../../../component/table/TableNoData'
import EditData from './EditData'

DataTable.propTypes = {
    refresh: PropType.bool,
}

const REF_TYPE =[
    {
        tab: 'Artist'
    },
    {
        tab: 'Cosplay'
    },
    {
        tab: 'Pose Reference'
    },
    {
        tab: 'Fashion Reference'
    },
    {
        tab: 'Fiction Character'
    },
]

export default function DataTable({ refresh }) {

    const [dataArr, setDataArr] = useState([])

    const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "MYBOOKMARKS"));
          const documents = querySnapshot.docs.map((doc) => ({
            userId: doc.id,
            ...doc.data(),
          }))
          setDataArr(documents);
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [refresh]);

    const {
        page,
        rowsPerPage,
        setPage,
        onChangeRowsPerPage,
    } = useTable()

    const [filterStatus, setFilterStatus] = useState('all')
    const [filterName, setFilterName] = useState('')
    const [onSort, setOnSort] = useState('')
    const tableContainerRef = useRef(null)
    const [tag, setTag] = useState('SFW')
    const [openPopover, setOpenPopover] = useState(null)
    const [selected, setSelected] = useState([])
    const [openWarning, setOpenWarning] = useState(false)
    const [openModify, setOpenModify] = useState(false)

    const dataWithNum = dataArr?.map((data, index) => ({
        num: index + 1,
        id: data.userId,
        date: moment(data.createdDate).format('DD/MM/YYYY'),
        time: moment(data.createdDate).format('hh:mm A'),
        ...data,
    }))

    const handleFilterName = (event) => {
        setPage(0)
        setFilterName(event.target.value)
    }

    const handleSelectSort = (event) => {
        setOnSort(event.target.value)
    }

    const dataFiltered = applyfilter ({
        inputData: dataWithNum,
        filterStatus,
        filterName,
        onSort,
        tag: tag,
    })

    const handleFilterStatus = (event, newValue) => {
        setFilterStatus(newValue)
    }

    const onChangePage = useCallback((event, newPage) => {
        setPage(newPage);
        if(tableContainerRef.current) {
            tableContainerRef.current.scrollTop = 0
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTag = (event) => {
        setTag(event.target.value)
    }

    const saveJsonToFile = () => {
        const json = JSON.stringify(dataArr, null, 2);
        const blob = new Blob([json], {type: 'application/json'});
        const date = moment(new Date()).format('YYYYMMDD hh:mm a');
        const filename = `data_${date}.json`
        saveAs(blob, filename)
    }

    const handleSelected = (data) => {
        console.log('handleSelected',data)
        setSelected(data)
        // setSelected(data)
    }

    const handleEdit = (data) => {
        setOpenModify(true)
        console.log('handleEdit', data)
    }

    const handleDelete = (id) => {
        console.log('handleDelete', id)
    }

    const handleOpenPopover = (event) => {
        setOpenPopover(event.currentTarget)
    }

    const handleClosePopover = () => {
        setOpenPopover(null);
    }

    const handleOpenWarning = (data) => {
        setSelected(data)
        setOpenWarning(true)
    }

    const handleCloseWarning = () => {
        setOpenWarning(false)
    }

    const handleCloseModify = () => {
        setOpenModify(false)
    }

    const handleTooLong = (remark) => {
        const truncatedRemark = remark && remark.length > 20 ? `${remark.slice(0, 20)}...` : remark;

        return (
            <Tooltip title={remark === "-" || !remark ? 'No remarks made' : remark}>
                <Typography
                    variant='caption'
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px', // Adjust as needed
                        display: 'inline-block'
                    }}
                >
                    {remark === "-" || !remark ? 'No remarks made' : truncatedRemark}
                </Typography>
            </Tooltip>
        );
    }

    const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!tag)

    return (
        <Container maxWidth='md'>
            <Dialog
                open={openModify}
                onClose={handleCloseModify}
            >
                <DialogContent>
                    <EditData data={selected} onClose={handleCloseModify} />
                </DialogContent>
            </Dialog>
            <Dialog
                open={openWarning}
                onClose={handleCloseWarning}
            >
                <DialogContent>
                    <DialogContentText sx={{width:'20rem', height:'5rem'}}>
                        Delete data of {`${selected.userName}`} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Stack direction='row' spacing={5}>
                        <Button 
                            variant='contained' 
                            sx={{bgcolor:'red'}} 
                            onClick={()=>{
                                handleDelete(selected.userId);
                                handleCloseWarning();
                            }}
                        >
                            Confirm
                        </Button>
                        <Button onClick={handleCloseWarning}>
                            Cancel
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
            <Tabs
                value={filterStatus}
                onChange={handleFilterStatus}
                variant='scrollable'
                scrollButtons='auto'
                sx={{
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem',
                    bgcolor:'gray',
                }}
            >
                <Tab label={`All (${dataArr?.length})`} value={'all'} />
                {REF_TYPE && REF_TYPE.map((tab, i) => (
                    // <Tab key={i} label={tab.tab.length > 5 ? tab.tab.slice(0,5) + '...' : tab.tab} value={tab.tab} />
                    <Tab key={i} label={tab.tab} value={tab.tab} />
                ))}
            </Tabs>

            {/* Toolbar Here */}
            <Stack
                direction='row'
                sx={{
                    p:'1rem'
                }}
                spacing={2}
            >
                <FormControl sx={{width:'25%'}}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                        value={onSort}
                        onChange={handleSelectSort}
                        MenuProps={{
                            style: {
                                maxHeight: '20rem'
                            }
                        }}
                    >
                        <MenuItem value="Name">Name (A-Z)</MenuItem>
                        <MenuItem value="NameReverse">Name (Z-A)</MenuItem>
                        <MenuItem value="DateCreated">Date Created (Old-New)</MenuItem>
                        <MenuItem value="DateCreatedReverse">Date Created (New-Old)</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{width:'30%'}}>
                    <InputLabel>
                        Data Filter
                    </InputLabel>
                    <Select value={tag} onChange={handleTag}>
                        <MenuItem value='all'>Show All</MenuItem>
                        <MenuItem value='SFW'>SFW</MenuItem>
                        <MenuItem value='NSFW'>NSFW</MenuItem>
                        <MenuItem value='Borderline'>Borderline</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    placeholder='Search by username...'
                    value={filterName}
                    onChange={handleFilterName}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchCircleIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Tooltip title="Save Data As Json">
                    <Button onClick={saveJsonToFile} variant='outlined' sx={{border:'1px solid rgb(200,200,200)'}}>
                        <DownloadIcon style={{width:'20px',height:'20px', }} />
                    </Button>
                </Tooltip>
                {filterName || onSort || tag !== 'all' || filterStatus !== 'all' ? 
                    <Button 
                        onClick={()=>{
                            setFilterName('');
                            setOnSort(''); 
                            setTag('all');
                            setFilterStatus('all')
                        }}
                    >
                        <TrashIcon style={{color:'red', width:'30px', height:'30px'}}/>
                    </Button> 
                : 
                    null
                }
            </Stack>

            <TableContainer ref={tableContainerRef} sx={{maxHeight: '60vh', overflow:'auto'}}>
                <Table>
                    <TableHead
                        sx={{
                            position:'sticky',
                            top: '0',
                            bgcolor: 'gray',
                            zIndex: 1,
                        }}
                    >
                        <TableRow>
                            <TableCell>Num</TableCell>
                            <TableCell align='center'>Username</TableCell>
                            <TableCell align='center'>Tag</TableCell>
                            <TableCell align='center'>Origin</TableCell>
                            <TableCell />
                            <TableCell>Date Created</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataFiltered?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((data, i) => (
                            <TableRow key={i}>
                                <TableCell>{data.num}</TableCell>
                                <TableCell align='center'>
                                    <Grid container>
                                        <Grid item xs={12} md={6}>
                                            <img
                                                src={data.userPicUrl}
                                                alt='Profile Pic'
                                                style={{
                                                    width:'60px', 
                                                    height:'60px', 
                                                    borderRadius:'50%'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} align='left'>
                                            <Stack direction ='column'>
                                                <Typography variant='subtitle1'>
                                                    {data.userName}
                                                </Typography>
                                                <div>
                                                    {handleTooLong(data.remark)}
                                                </div>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell >
                                    <Box 
                                        sx={{
                                            display:'flex',
                                            justifyContent:'center',
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
                                <TableCell align='center'>
                                    {data.charOrigin}
                                </TableCell>
                                <TableCell />
                                <TableCell>
                                    <Stack direction='column' spacing={1}>
                                        <Typography variant='body1'>
                                            {data.date}
                                        </Typography>
                                        <Typography variant='caption'>
                                            {data.time}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell align='right'>
                                    <IconButton 
                                        sx={{width:'fit-Content'}} 
                                        onClick={(event)=>{
                                            handleSelected(data)
                                            handleOpenPopover(event)
                                        }}
                                    >
                                        <DotsVerticalIcon style={{height:'20px', width:'20px'}} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableEmptyRows
                            emptyRows={emptyRows(page, rowsPerPage, dataArr.length)}
                        />
                        <TableNoData isNotFound={isNotFound} />
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePaginationCustom
                sx={{bgcolor:'gray', borderBottomRightRadius:'1rem', borderBottomLeftRadius:'1rem'}}
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
                        handleEdit(selected)
                        handleClosePopover();
                    }}
                >
                    <PencilAltIcon style={{width:'20px', height:'20px', color: 'blue'}} />
                    Modify
                </MenuItem>
                <MenuItem
                    onClick={()=>{
                        // handleDelete(passingData.data_rowid);
                        handleOpenWarning(selected)
                        handleClosePopover();
                        // setSubmit(true);
                    }}
                >
                    <TrashIcon style={{width:'20px', height:'20px', color:'red'}} />
                    Delete
                </MenuItem>
            </Popover>
        </Container>
    )
}

function applyfilter ({ inputData, filterStatus, filterName, onSort, tag }) {
    if (filterStatus !== 'all') {
        inputData = inputData.filter((data)=>data.reftype === filterStatus)
    }
    if (filterName) {
        inputData = inputData.filter((name)=>{
            const nameMatch = name.userName?.toLowerCase().includes(filterName.toLowerCase());
            const originMatch = name.charOrigin?.toLowerCase().includes(filterName.toLowerCase());
            return nameMatch || originMatch ;
        })
    }
    switch (onSort) {
        case 'Name':
            inputData.sort((a,b) => a.userName.localeCompare(b.userName))
            break
        case 'NameReverse':
            inputData.sort((b,a) => a.userName.localeCompare(b.userName))
            break
        case 'DateCreated':
            inputData.sort((a,b) => a.createdDate.localeCompare(b.createdDate))
            break
        case 'DateCreatedReverse':
            inputData.sort((b,a) => a.createdDate.localeCompare(b.createdDate))
            break
        default:
            inputData.sort((a,b) => a.num - b.num)
    }
    if(tag !== 'all') {
        inputData = inputData.filter((data)=>{
            const filteredData = data.userTag === tag;
            return filteredData
        })
    }

    return inputData;
}
