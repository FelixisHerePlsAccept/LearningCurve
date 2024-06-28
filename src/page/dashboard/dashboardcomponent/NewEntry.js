import * as Yup from 'yup'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useMemo, useState } from 'react'
import { RHFSelect, RHFTextField } from '../../../component/hook-form'
import { Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import FormProvider from '../../../component/hook-form/FormProvider'
import { yupResolver } from '@hookform/resolvers/yup'

export default function NewEntry() {

    const [listRef, setListRef] = useState([])

    const [view, setView] = useState([])
    
    const [open, setOpen] = useState(false);

    // const [submit, setSubmit] = useState(false)

    const newSchema = Yup.object().shape({
        ref: Yup.number().required("REQUIRED"),
        name: Yup.string().required('REQUIRED'),
        url: Yup.string().required('REQUIRED'),
        origin: Yup.string().nullable(true),
    })

    const defaultValue = useMemo(
        ()=> ({
            ref: null,
            name: '',
            url: '',
            origin:'',        
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
        fetch('http://localhost:1000/reference')
        .then(res => res.json())
        .then(data=> {
            setListRef(data);
        })
        .catch(err => console.error(err))
    },[])

    useEffect (() => {
        fetch('http://localhost:1000/view')
        .then(res => res.json())
        .then(data=> {
            setView(data);
        })
        .catch(err => console.error(err))
    },[])

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
        // watch,
        control,
        // setValue,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const clearInput = () => {
        reset(defaultValue);
        if(!errorOpen) {
            setOpen(true)
        }
    }

    const onSubmit = async (data) => {
        const dateTime = CreatedDate();
        const noSimilar = view.find((same) => same.data_name === data.name)
        const noSimilar2 = view.find((same) => same.ref_id === data.ref_id)
        console.log(noSimilar, noSimilar2)
        console.log('data',data, typeof dateTime)
        if (noSimilar && noSimilar2) {
            handleOpenError();
            console.log('failed')
            return; // Return early if a similar name exists
        }
        try {
            const response = await fetch('http://localhost:1000/create', {
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
                    // nameAtServerJs = nameHere
                })
            })
            if (response.ok) {
                console.log('SUCCESSFULLY PASSED');
                clearInput();
            }
            else {
                console.log('FAILED ENTRANCE')
            }

        }
        catch (error) {
            console.error('FETCH ERROR: ', error)
        }
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
                <Grid container sx={{p:'1rem'}}>
                    <Grid item xs={12} md={4}>
                        <Typography variant='h5'>
                            New Data Entry
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                            <Stack direction={'column'} spacing={3}>
                                {/* <RHFSelect native name='ref' label='Reference Type' placeholder='Reference'>
                                    <option value={null} />
                                    {listRef.length > 0 && 
                                    listRef.map((ref,i)=>(
                                        <option key={i} value={ref.ref_id}>
                                            {ref.ref_name}
                                        </option>
                                    ))
                                    }
                                </RHFSelect> */}
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
                                <RHFTextField
                                    name='name'
                                    label='Name'
                                />
                                <RHFTextField
                                    name='url'
                                    label='Picture URL'
                                    multiline
                                    minRows={2}
                                />
                                <RHFTextField
                                    name='origin'
                                    label='Origin'
                                />
                                <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                                    Create new list
                                </LoadingButton>
                            </Stack>
                        </FormProvider>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}
