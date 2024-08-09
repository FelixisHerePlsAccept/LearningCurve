import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { addDoc, collection, deleteDoc, doc, setDoc} from 'firebase/firestore'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Popover, Select, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import moment from 'moment'
import { saveAs } from 'file-saver'
import { db } from '../../../firebase'
import { emptyRows, TableEmptyRows, TablePaginationCustom, useTable } from '../../../component/table'
import TableNoData from '../../../component/table/TableNoData'
import EditData from './EditData'
import NewEntry from './NewEntry'
import { DocumentArrowDownIcon, EllipsisVerticalIcon, GlobeAltIcon, MagnifyingGlassCircleIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import DataContext from '../../../Provider/DataProvider/DataProvider'
import AuthContext from '../../../Provider/AuthProvider/AuthGuard'
import twitterBird from '../mock/twitter-bird.png'

// DataTable.propTypes = {
//     search: PropTypes.bool,
//     userSearch: PropTypes.string
// }

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

export default function DataTable() {

    const location = useLocation();
    const { search, userSearch } = location.state || { search: false, userSearch: '' };

    console.log('search', search, 'userSearch', userSearch)

    const { dataRetrieved, maxQuota } = useContext(DataContext)
    const { currentUser } = useContext(AuthContext)

    console.log('dataRetrieved', dataRetrieved)

    const [dataArr] = useState( dataRetrieved || [])
    const [openCreate, setOpenCreate] = useState(false)
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterName, setFilterName] = useState('')
    const [onSort, setOnSort] = useState('')
    const tableContainerRef = useRef(null)
    const [tag, setTag] = useState('SFW')
    const [openPopover, setOpenPopover] = useState(null)
    const [selected, setSelected] = useState([]) // change to object
    const [openWarning, setOpenWarning] = useState(false)
    const [openModify, setOpenModify] = useState(false)
    const [reason, setReason] = useState('')

    const {
        page,
        rowsPerPage,
        setPage,
        onChangeRowsPerPage,
    } = useTable()

    const dataArrFiltered = dataArr?.filter((data) => data.docId !== 'null')

    const dataWithNum = dataArrFiltered
    ?.sort((a,b) => moment(a.createdDate).format('YYYYMMDD HH:mm').localeCompare(moment(b.createdDate).format('YYYYMMDD HH:mm')))
    .map((data, index) => ({
        num: index + 1,
        id: data.docId,
        date: moment(data.createdDate).format('DD MMMM YYYY'),
        time: moment(data.createdDate).format('hh:mm A'),
        ...data,
    }))

    const handleFilterName = (event) => {
        setPage(0)
        setFilterName(event.target.value)
    }

    useEffect (() => {
        if (search) {
            setOnSort('')
            setTag('all')
            setFilterName(userSearch)
        }
    }, [search, userSearch])

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

    const handleDelete = async (data) => {
        console.log(currentUser.userRole)
        if (currentUser.userRole !== 'Admin') {
            await setDoc(doc(db, "RequestedDelete", data?.id), {
                requestedBy: currentUser?.userName || "-",
                actionRequested: `Delete ${data?.userName} ` || "-",
                userName: data?.userName || "-",
                userPicUrl: data?.userPicUrl || "-",
                websiteUrl: data?.websiteUrl || "-",
                charOrigin: data?.charOrigin || "-",
                remark: data?.remark || "-",
                createdDate: data?.createdDate || "-",
                reftype: data?.reftype || "-",
                userTag: data?.userTag || "-",
                reasonForDeletion: reason || "No reason provided",   
            })
            const notifyStatus = await addDoc(collection(db, "NotificationStatus"), {
                requestedBy: currentUser?.userName || "-",
                userName: data?.userName || "-",
                notifyType: 'delete',
                status: 'pending',
            })
            await setDoc(doc(db, "NotificationStatus", notifyStatus.id), {
                docId: notifyStatus.id
            },{ merge: true })
            setReason('')
        } else {
            const docRef = doc(db, "MYBOOKMARKS", data.id);
            await deleteDoc(docRef)
            console.log(`Document ${data.id} has been deleted`)
        }
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

    console.log(typeof selected)

    const handleCloseWarning = () => {
        setOpenWarning(false)
    }

    const handleCloseModify = () => {
        setOpenModify(false)
    }

    const handleImgError = (name) => (
        <Alert severity="warning">
            <Typography variant="body1">
                Image not found {name}
            </Typography>
        </Alert>
    )

    const handleRedirect = (name) => {
        window.open(`https://x.com/${name}/media`, '_blank');
    }
    
    const handleRedirectWebsite = (name) => {
        window.open(name, '_blank');
    }

    const handleTooLong = (remark) => {
        const truncatedRemark = remark && remark.length > 20 ? `${remark.slice(0, 20)}...` : remark;

        return (
            <Tooltip title={remark === "-" || !remark ? 'No remarks made' : remark}>
                <Typography
                    variant='caption'
                    sx={{
                        textTransform:'capitalize', 
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

    const onSubmitClose = () => {
        setOpenCreate(false)
    }

    const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!tag)

    if(maxQuota) {
        return (
            <>
                <Container maxWidth='md'>
                    <Typography variant='h6' sx={{textAlign:'center', p:'1rem'}}>
                        Quota Exceeded, Sorry
                    </Typography>
                </Container>
            </>
        )
    }
    return (
        <Container maxWidth='md'>
            <Dialog
                open={openModify}
                onClose={handleCloseModify}
            >
                <DialogContent>
                    {currentUser && currentUser.userRole !== "Admin" 
                    ? 
                        <EditData editData={selected} onClose={handleCloseModify} isRequest={true}  />
                    : 
                        <EditData editData={selected} onClose={handleCloseModify} />
                    }
                    
                </DialogContent>
            </Dialog>
            <Dialog
                open={openCreate}
                onClose={onSubmitClose}
            >
                <DialogContent>
                    {currentUser && currentUser.userRole !== "Admin" ?
                        <NewEntry onClose={onSubmitClose} prevData={dataArr} isRequest={true} />
                    :
                        <NewEntry onClose={onSubmitClose} prevData={dataArr} />
                    }
                    
                </DialogContent>
            </Dialog>
            <Dialog
                open={openWarning}
                onClose={handleCloseWarning}
            >
                <DialogContent>
                    <DialogContentText>
                        {currentUser && currentUser.userRole !== "Admin" ? 
                            <Typography>
                                Inform Admin of Your Choice to Delete {`${selected.userName}`} ?
                            </Typography>
                        :
                            <Typography>
                                Delete data of {`${selected.userName}`} ?
                            </Typography>
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={2}>
                        {currentUser && currentUser.userRole !== "Admin" 
                        ?
                        <Grid item xs={12} sx={{ml:'1rem'}}>
                            <Typography>
                                Provide Your Reasoning:
                            </Typography>
                            <TextField
                                sx={{
                                    width:'95%'
                                }}
                                multiline
                                minRows={2}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </Grid>
                        :
                        null
                        }
                        <Grid item xs={12} sx={{display:'flex', justifyContent:'flex-end'}}>
                            <Stack direction='row' sx={{alignItems:'flex-end'}} spacing={2}>
                                <Button 
                                    variant='contained' 
                                    sx={{
                                        bgcolor:'red',
                                    }} 
                                    onClick={()=>{
                                        handleDelete(selected);
                                        handleCloseWarning();
                                    }}
                                >
                                    Confirm
                                </Button>
                                <Button onClick={handleCloseWarning}>
                                    Cancel
                                </Button>
                            </Stack>    
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Box sx={{width:'100%', pb:".5rem"}}>
                <Box sx={{display:'flex', justifyContent:'flex-end'}}>
                    <Button variant='contained' onClick={() => setOpenCreate(true)} sx={{bgcolor:'lightgreen'}}>
                        <Stack direction='row' spacing={1} sx={{alignItems:'center'}}>
                            <Typography>
                                Add New Entry
                            </Typography>
                            <PlusIcon style={{width:'1rem', height:'1rem'}} />
                        </Stack>
                    </Button>
                </Box>
            </Box>
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
                    p:'.5rem'
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
                                <MagnifyingGlassCircleIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Tooltip title="Save Data As Json">
                    <Button onClick={saveJsonToFile} variant='outlined' sx={{border:'1px solid rgb(200,200,200)'}}>
                        <DocumentArrowDownIcon style={{width:'20px',height:'20px', }} />
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
                            <TableCell align='center'>Website Redirect</TableCell>
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
                                                onError={()=>handleImgError(data.userName)}
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
                                <TableCell>
                                    <Stack direction='row' sx={{width:'100%'}} justifyContent='space-evenly'>
                                        <Tooltip title={`Open ${data.userName}'s Twitter`}>
                                            <IconButton size='small' sx={{borderRadius:'50%'}} onClick={() => handleRedirect(data.userName)}>
                                                <img src={twitterBird} alt='' style={{width:'20px', height:'20px', borderRadius:'50%'}} />
                                            </IconButton>
                                        </Tooltip>
                                        {data.websiteUrl !== '-' && 
                                        (
                                            <Tooltip title={`Open other associated website to the ${data.userName}`}>
                                                <IconButton size='small' sx={{borderRadius:'50%'}} onClick={() => handleRedirectWebsite(data.websiteUrl)}>
                                                    <GlobeAltIcon style={{width:'20px', height:'20px', borderRadius:'50%'}} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
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
                                        <Typography variant='subtitle2'>
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
                                        <EllipsisVerticalIcon style={{height:'20px', width:'20px'}} />
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
                    <PencilIcon style={{width:'20px', height:'20px', color: 'blue'}} />
                    Modify
                </MenuItem>
                <MenuItem
                    onClick={()=>{
                        handleOpenWarning(selected)
                        handleClosePopover();
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
