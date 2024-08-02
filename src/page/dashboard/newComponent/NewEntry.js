import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormProvider from '../../../component/hook-form/FormProvider'
import { RHFSelect, RHFTextField } from '../../../component/hook-form'
import { Button, Grid, MenuItem, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { db } from '../../../firebase'
import moment from 'moment/moment'

NewEntry.propTypes = {
    setRefresh: PropTypes.func,
    onSubmitClose: PropTypes.func,
    refresh: PropTypes.bool
}

export default function NewEntry({ refresh, setRefresh, onSubmitClose }) {

    const [dataArr, setDataArr] = useState([])

    const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "MYBOOKMARKS"));
          const documents = querySnapshot.docs.map(doc => doc.data().userName);
          setDataArr(documents);
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [refresh]);
    

    const NewSchema = Yup.object().shape({
        userName: Yup.string().required('Name is required'),
        userPicUrl: Yup.string().nullable(true),
        reftype: Yup.string().required('Reference Type is required'),
        userTag: Yup.string().required('Tag is required'),
        websiteUrl: Yup.string().nullable(true),
        charOrigin: Yup.string().nullable(true),
        remark: Yup.string().nullable(true),
    })

    const defaultValue = useMemo(
        () => ({
            userName: '',
            userPicUrl: '',
            reftype: '',
            userTag: '',
            websiteUrl: '',
            charOrigin: '',
            remark: '',
        }),
        []
    )

    const methods = useForm({
        resolver: yupResolver(NewSchema),
        defaultValue,
    })

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const watchImage = watch('userPicUrl')
    const watchName = watch('userName')
    const watchTag = watch('userTag')

    const handleOpenWindow = (event) => {
        const targetElement = event.currentTarget;
        const rect = targetElement.getBoundingClientRect();
        console.log(rect);
        
        const width = 500;
        const height = 500;
        const top = rect.top + window.scrollY;
        const left = rect.left + window.scrollX + rect.width;
    
        // Ensure the new window opens on the same screen as the current window
        const screenX = window.screenX || window.screenLeft;
        const screenY = window.screenY || window.screenTop;
    
        const adjustedLeft = screenX + left;
        const adjustedTop = screenY + top;
    
        window.open(`https://x.com/${watchName}/photo`, '_blank', `width=${width},height=${height},top=${adjustedTop},left=${adjustedLeft}`);
    }
    
    const onSubmit = async (data) => {
        const noSimilar = dataArr.find((same) => same === data.userName);
        if (noSimilar) {
            alert('Name already exists!')
            reset(defaultValue);
            return;
        }
        try {
            await addDoc(collection(db,'MYBOOKMARKS'), {
                userName: data?.userName || "-",
                userPicUrl: data?.userPicUrl || "-",
                reftype: data?.reftype || "-",
                userTag: data?.userTag || "-",
                websiteUrl: data?.websiteUrl || "-",
                charOrigin: data?.charOrigin || "-",
                remark: data?.remark || "-",
                createdDate: moment(new Date()).format('YYYY-MM-DD hh:mm:ss A'),
            })
            setRefresh((prev) => !prev)
            onSubmitClose()
            reset(defaultValue)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid
                container
                spacing={2}
                sx={{
                    p:'0 5rem 1rem 5rem',
                }}
            >
                <Grid 
                    item 
                    xs={12} md={4} 
                    sx={{
                        width:'20rem',
                        display:'flex',
                        justifyContent:'left',
                        alignItems:'center',
                        height:'25rem'
                    }}
                >
                    <Stack 
                        direction='column' 
                        spacing={2}
                        sx={{
                            display:'flex',
                            justifyContent:'left',
                            alignItems:'center'
                        }}
                    >
                        <Typography variant='h5'>
                            Image Preview
                        </Typography>
                        <img 
                            src={watchImage} 
                            alt='' 
                            style={{
                                width:'15rem', 
                                height:'15rem', 
                                borderRadius:'50%',
                                border:'1px solid black'
                            }}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} md={1} />
                <Grid 
                    item 
                    xs={12} md={7} 
                    sx={{
                        width:'30rem'
                    }}
                >
                    <Stack 
                        direction='column' 
                        spacing={2} 
                        sx={{ 
                            display:'flex', 
                            justifyContent:'center', 
                            alignItems:'center'
                        }}
                    >
                        <RHFTextField name="userName" label="Name" />
                        <Grid container>
                            <Grid item xs={12} md={!watchName ? 12 : 7}>
                                <RHFTextField 
                                    name="userPicUrl" 
                                    label="Profile Picture URL" 
                                    minRows={2}
                                    multiline
                                />
                            </Grid>
                            {watchName && (
                                <>
                                <Grid item xs={12} md={1} />
                                <Grid item xs={12} md={4}>
                                    <Button variant='contained' sx={{height:'100%'}} onClick={handleOpenWindow}>
                                        Show Photo (Twitter)?
                                    </Button>
                                </Grid>
                                </>
                            )}
                        </Grid>
                        
                        <Stack 
                            direction='row' 
                            spacing={2} 
                            sx={{
                                width:'100%'
                            }}
                        >
                            <Controller
                                name='reftype'
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                    <RHFSelect
                                        {...field}
                                        label="Reference Type"
                                        placeholder="Reference"
                                    >
                                        <MenuItem value={null} />
                                        <MenuItem value={'Artist'}>Artist</MenuItem>
                                        <MenuItem value={'Cosplay'}>Cosplay</MenuItem>
                                        <MenuItem value={'Pose Reference'}>Pose Reference</MenuItem>
                                        <MenuItem value={'Fashion Reference'}>Fashion Reference</MenuItem>
                                        <MenuItem value={'Fiction Character'}>Fiction Character</MenuItem>
                                    </RHFSelect>
                                )}
                            />
                            <Controller
                                name='userTag'
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                    <RHFSelect
                                        {...field}
                                        label="Tag"
                                        placeholder="Tag"
                                    >
                                        <MenuItem value={null} />
                                        <MenuItem value={'SFW'}>SFW</MenuItem>
                                        <MenuItem value={'Borderline'}>Borderline</MenuItem>
                                        <MenuItem value={'NSFW'}>NSFW</MenuItem>
                                    </RHFSelect>
                                )}
                            />
                        </Stack>
                        <Stack direction='row' sx={{width:'100%'}} spacing={1}>
                            <Typography variant='caption' sx={{alignSelf: 'center'}}>Provide Remark for This Artist</Typography>
                            <Typography variant='h6' sx={{alignSelf: 'center'}}>:</Typography>
                            <RHFTextField name='remark' label="Remark" />
                        </Stack>
                        <RHFTextField name="websiteUrl" label="Website URL" />
                        <RHFTextField name="charOrigin" label="Origin" />
                        <LoadingButton fullWidth type="submit" variant="contained" loading={isSubmitting}>
                            Create new list
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Grid>
        </FormProvider>
    )
}
