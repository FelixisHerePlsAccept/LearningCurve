import PropTypes from 'prop-types'
import axios from "axios"
import * as Yup from 'yup'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useMemo, useState } from 'react'
import { RHFSelect, RHFTextField, RHFUploadBox } from '../../../component/hook-form'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import FormProvider from '../../../component/hook-form/FormProvider'
import { yupResolver } from '@hookform/resolvers/yup'

NewEntry.propTypes = {
    setCrud: PropTypes.func,
}

export default function NewEntry({setCrud, onSubmitChange}) {

    const [listRef, setListRef] = useState([])
    const [view, setView] = useState([])
    const [open, setOpen] = useState(false);
    const [ProductImage, setImages] = useState('')
    const [filename, setFileName] = useState()

    // const [submit, setSubmit] = useState(false)

    const newSchema = Yup.object().shape({
        ref: Yup.number().required("REQUIRED"),
        name: Yup.string().required('REQUIRED'),
        url: Yup.string().nullable(true),
        origin: Yup.string().nullable(true),
        tag: Yup.string().nullable(true),
    })

    const defaultValue = useMemo(
        ()=> ({
            ref: null,
            name: '',
            url: '',
            origin:'',
            tag:'',
        }),
        []
    )

    const CreatedDate = () => {
        const date = new Date()
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based (0 = January)
        const day = date.getUTCDate().toString().padStart(2, '0');
        const ymd = `${year}-${month}-${day}`
        const hour = date.getHours();
        const minute = date.getMinutes();
        const formatted24 = hour.toString().padStart(2, '0');
        const formattedDate = `${ymd} ${formatted24}:${minute}`
        return formattedDate;
    }

    console.log('createdDate',CreatedDate())

    const methods = useForm({
        resolver: yupResolver(newSchema),
        defaultValue,
    })

    useEffect (() => {
        fetch('https://backend-r2i9.onrender.com/reference')
        .then(res => res.json())
        .then(data=> {
            setListRef(data);
        })
        .catch(err => console.error(err))
    },[])

    useEffect (() => {
        fetch('https://backend-r2i9.onrender.com/view')
        .then(res => res.json())
        .then(data=> {
            setView(data);
        })
        .catch(err => console.error(err))
    },[open])

    console.log('view',view)

    const [errorOpen, setErrorOpen] = useState(false);

    const handleOpenError = () => {
      setErrorOpen(true);
    };
  
    const handleCloseError = () => {
        clearInput();
        setErrorOpen(false);
    };

    const handleClose = () => {
        setOpen(false)
    }

    const {
        reset,
        // trigger,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const clearInput = () => {
        reset(defaultValue);
        if(!errorOpen) {
            setOpen(true)
        }
    }

    const previewUrl = watch('url')

    const reftype = watch('ref')

    const twitter_name = watch('name')

    const image = watch('image')

    console.log('image', image)

    console.log(previewUrl)

    const onSubmit = async (data) => {
        const dateTime = CreatedDate();
        const noSimilar = view.find((same) => same.data_name === data.name);
        const similarRef = noSimilar && noSimilar.ref_id === data.ref ? noSimilar : null;
        if (similarRef) {
            handleOpenError();
            console.log('similarRef returns: ', similarRef);
            return;
        }
        try {
            const response = await fetch('https://backend-r2i9.onrender.com/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ref: data.ref,
                    name: data.name,
                    url: data.url,
                    origin: data.origin,
                    datetime: dateTime,
                    tag: data.tag,
                    // nameAtServerJs = nameHere
                })
            })
            if (response.ok) {
                if(data.ref === 8){
                    console.log('data.ref', data.ref, 'data_rowid', data.name)
                    handleUpload(data.name);
                }
                else {
                    console.log('SUCCESSFULLY PASSED');
                }
                setImages('');
                setValue('image','');
                clearInput();
                setCrud(prev=>!prev);
                onSubmitChange();
            }
            else {
                console.log('FAILED ENTRANCE')
            }

        }
        catch (error) {
            console.error('FETCH ERROR: ', error)
        }
    }

    const handleUpload = (name) => {
        console.log('data.name', name)
        console.log('handleUpload here')
        const formdata = new FormData()
        formdata.append('image', filename)
        formdata.append('name', name)
        axios.post('https://backend-r2i9.onrender.com/upload', formdata)
        .then()
        .catch(err=>console.log(err))
    }

    const handleDrop = (acceptedFile) => {
        const file = acceptedFile[0];
        setFileName(file)
        if(file) {
            const previewUrl = URL.createObjectURL(file);
            console.log('previewUrl',previewUrl)
            setImages(previewUrl)
            setValue('image', previewUrl, {shouldValidate:true})
        }
    }
    console.log('filename', filename)

    const removeImage = () => {
        URL.revokeObjectURL(ProductImage)
        setImages('');
        setFileName();
        setValue('image','',{shouldValidate:true})
    }

    const handleOpenWindow = () => {
        window.open(`https://x.com/${twitter_name}/photo`, '_blank', 'width=500,height=500,top=300,left=1275')
    }

    return (
        <>
            <Snackbar
                ContentProps={{ sx: {background: 'white', color: 'green'}}}
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message="Data added successfully"
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            />
            <Dialog open={errorOpen} onClose={handleCloseError}>
                <DialogTitle>
                    Error
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Name already exists. Please choose a different name.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseError}>OK</Button>
                </DialogActions>
            </Dialog>
            <Card elevation={3}>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container sx={{p:'1rem'}} spacing={2}>
                        <Grid item xs={12} md={5}>
                            <Typography variant='h5' sx={{pb:'3rem'}}>
                                New Data Entry
                            </Typography>
                            {reftype !== null && reftype !== 3 && previewUrl ? (
                                <Box sx={{maxHeight:'40vh', height:'auto', width:'100%', borderRadius:'2rem', justifyContent:'center', alignItems:'center', border:'1px solid black'}}>
                                <Stack direction={'column'} spacing={3} justifyContent={'center'} sx={{p:'1rem'}}>
                                    <Box sx={{width:'100%', height:'auto'}}>
                                        <Typography variant='h6' sx={{textAlign:'center'}}>
                                            Image Preview
                                        </Typography>
                                        <Box sx={{display:'flex' ,justifyContent:'center', alignItems:'center'}} >
                                            <img src={previewUrl} alt='' style={{height:'15rem', width: '15rem', borderRadius:'50%'}} />
                                        </Box>
                                    </Box>
                                </Stack>
                            </Box>
                            ):
                                reftype === 8 ? (
                                    ProductImage === '' || null ?
                                    (
                                        <Stack direction={'column'} spacing={5} sx={{justifyContent:'center', alignItems:'center'}}>
                                            <Typography>
                                                Drop Image Here
                                            </Typography>
                                            <RHFUploadBox
                                                // name="images"
                                                name="image"
                                                maxSize={5000000}
                                                onDrop={handleDrop}
                                                sx={{
                                                    width:'10rem',
                                                    height:'10rem'
                                                }}
                                                // multiple={true}
                                                // files={false}
                                            />
                                        </Stack>
                                    )
                                :
                                (
                                    <Grid container>
                                        <Stack direction="row" spacing={3}>
                                            {ProductImage && (
                                                <Grid item xs={12}>
                                                    <img src={ProductImage} alt="Uploaded" style={{margin:'5px 0 5px 0 ', borderRadius:'1rem', width:'50rem', height:'50rem'}} />
                                                    <button type="button" onClick={removeImage}>Remove</button>
                                                </Grid>
                                            )}
                                        </Stack>
                                    </Grid>
                                )
                            ):
                            null
                            }
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Stack direction={'column'} spacing={3}>
                                <Stack direction={'row'} sx={{justifyContent:'left', alignItems:'center'}}>
                                    <Typography sx={{width:'fit-content'}}>
                                        Date of entrance:&nbsp;&nbsp;
                                    </Typography>
                                <TextField
                                    name='datetime'
                                    fullWidth
                                    disabled={true}
                                    value={CreatedDate()}
                                />
                                </Stack>
                                <Controller
                                    name="ref"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <RHFSelect
                                            {...field}
                                            label="Reference Type"
                                            placeholder="Reference"
                                            
                                        >
                                            {/* <MenuItem value={null} /> */}
                                            {listRef.map((ref) => (
                                                <MenuItem key={ref.ref_id} value={ref.ref_id}>
                                                {ref.ref_name}
                                                </MenuItem>
                                            ))}
                                        </RHFSelect>
                                    )}
                                />
                                {reftype ? (
                                    <>
                                    <RHFTextField
                                    name='name'
                                    label='Name'
                                    />
                                    {(reftype === 1 || reftype === 2) && twitter_name && (
                                        <Stack direction={'row'}>
                                            <Typography variant='caption'>
                                                Show user image?
                                            </Typography>
                                            <Button onClick={handleOpenWindow}>
                                                Open
                                            </Button>
                                        </Stack>
                                    )}
                                    {reftype !== 8 ? (
                                        <RHFTextField
                                            name='url'
                                            label={reftype === 3 ? 'Website URL' : 'Picture URL'}
                                            multiline
                                            minRows={2}
                                        />
                                    ) : (
                                        null
                                    )}
                                    <Controller
                                        name="tag"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <RHFSelect
                                                {...field}
                                                label="Tag"
                                                placeholder="Tag"
                                            >
                                                <MenuItem value={'SFW'}>SFW</MenuItem>
                                                <MenuItem value={'NSFW'}>NSFW</MenuItem>
                                                <MenuItem value={'Borderline'}>Borderline</MenuItem>
                                            </RHFSelect>
                                        )}
                                    />
                                    <RHFTextField
                                        name='origin'
                                        label='Origin'
                                    />
                                    <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                                        Create new list
                                    </LoadingButton>
                                    </>
                                )
                                :
                                (
                                    null
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </FormProvider>
            </Card>
        </>
    )
}
