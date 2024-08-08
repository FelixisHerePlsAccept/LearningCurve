import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormProvider from '../../../component/hook-form/FormProvider'
import { RHFSelect, RHFTextField } from '../../../component/hook-form'
import { Box, Button, Grid, MenuItem, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { db } from '../../../firebase'
import moment from 'moment/moment'
import AuthContext from '../../../Provider/AuthProvider/AuthGuard'

NewEntry.propTypes = {
    onClose: PropTypes.func,
    prevData: PropTypes.array,
    isRequest: PropTypes.bool,
}

export default function NewEntry({ onClose, prevData, isRequest=false }) {    

    const {currentUser} = useContext(AuthContext)

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
        const noSimilar = prevData?.find((same) => same.userName === data.userName);
        if (noSimilar) {
            alert('Name already exists!')
            reset(defaultValue);
            return;
        }
        if (!isRequest) {
            console.log('false isRequest')
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
                onClose()
                reset(defaultValue)
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('true isRequest')
            try {
                const retrieveID = await addDoc(collection(db, "RequestCreate"), {
                    requestedBy: currentUser?.userName || "-",
                    userName: data?.userName || "-",
                    userPicUrl: data?.userPicUrl || "-",
                    reftype: data?.reftype || "-",
                    userTag: data?.userTag || "-",
                    websiteUrl: data?.websiteUrl || "-",
                    charOrigin: data?.charOrigin || "-",
                    remark: data?.remark || "-",
                    createdDate: moment(new Date()).format('YYYY-MM-DD hh:mm:ss A'),
                })
                await setDoc(doc(db, "RequestCreate", retrieveID.id), {
                    docId: retrieveID.id
                },{ merge: true })
                onClose()
                reset(defaultValue)
            } catch (error) {
                console.log(error)
                alert('Failure in saving data, contact admin');
            }
        }
    }

    return (
        <Box 
            sx={{
                width:'30vw',
                height:'80vh',
                // p:'0 5rem 1rem 5rem',
            }}
        >
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5} sx={{p:'1rem'}}>
                        <Stack 
                            direction='column' 
                            spacing={2}
                            sx={{
                                display:'flex',
                                justifyContent:'left',
                                alignItems:'center',
                            }}
                        >
                            <Typography variant='h5' sx={{textAlign:'center'}}>
                                Image Preview
                            </Typography>
                            <img 
                                src={watchImage} 
                                alt='' 
                                style={{
                                    width:'10rem', 
                                    height:'10rem', 
                                    borderRadius:'50%',
                                    border:'1px solid black'
                                }}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={7} sx={{p:'1rem'}}>
                        <Stack direction='column' spacing={1}>
                            <RHFTextField name='userName' showLabel={true} />
                            <RHFTextField name='userPicUrl' showLabel={true} minRows={2} multiline /> 
                            {watchName && (
                                <Button variant='contained' onClick={handleOpenWindow} fullWidth color='secondary'>
                                    Open User Profile
                                </Button>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sx={{p:'0 1rem 0 1rem'}}>
                        <Stack direction='row' spacing={2}>
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
                                        <MenuItem value={null} disabled />
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
                                        <MenuItem value={null} disabled />
                                        <MenuItem value={'SFW'}>SFW</MenuItem>
                                        <MenuItem value={'Borderline'}>Borderline</MenuItem>
                                        <MenuItem value={'NSFW'}>NSFW</MenuItem>
                                    </RHFSelect>
                                )}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sx={{p:'0 1rem 0 1rem'}}>
                        <Stack spacing={2}>
                            <Stack direction='column' spacing={1}>
                                <Typography variant='caption'>Provide Remark for This Artist :</Typography>
                                <RHFTextField name='remark' label="Remark" sx={{textTransform: 'capitalize'}} />
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
        </Box>
    )
}
