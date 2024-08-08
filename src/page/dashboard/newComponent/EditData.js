import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import PropType from 'prop-types'
import React, { useContext, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import FormProvider from '../../../component/hook-form/FormProvider'
import { RHFSelect, RHFTextField } from '../../../component/hook-form'
import { Box, Divider, Grid, MenuItem, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import AuthContext from '../../../Provider/AuthProvider/AuthGuard'
import moment from 'moment'

EditData.propTypes = {
    editData: PropType.object,
    onClose: PropType.func,
    isRequest: PropType.bool,
}

export default function EditData({ editData, onClose, isRequest=false}) {

    console.log(isRequest)

    const {currentUser} = useContext(AuthContext)

    const EditSchema = Yup.object().shape({
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
            userName: editData?.userName || '',
            userPicUrl: editData?.userPicUrl || '',
            reftype: editData?.reftype || '',
            userTag: editData?.userTag || '',
            websiteUrl: editData?.websiteUrl || '',
            charOrigin: editData?.charOrigin || '',
            remark: editData?.remark || '',
        }),
        [editData]
    )

    const methods = useForm({
        resolver: yupResolver(EditSchema),
        defaultValue
    })

    const {
        control,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    useEffect(() => {
        reset(defaultValue)
    }, [defaultValue, reset])

    const onSubmit = async (data) => {
        if (!isRequest) {
            try {
                await updateDoc(doc(db, "MYBOOKMARKS", editData.id), {
                    userName: data?.userName || "-",
                    userPicUrl: data?.userPicUrl || "-",
                    reftype: data?.reftype || "-",
                    userTag: data?.userTag || "-",
                    websiteUrl: data?.websiteUrl || "-",
                    charOrigin: data?.charOrigin || "-",
                    remark: data?.remark || "-",
                })
                onClose()
            } catch (error) {
                console.log(error)
            }
        }
        else {
            try {
                await setDoc(doc(db, "RequestedChange", editData.id), {
                    requestedBy: currentUser?.userName || "-",
                    actionRequested: `Data Change on ${data?.userName} ` || "-",
                    userName: data?.userName || "-",
                    userPicUrl: data?.userPicUrl || "-",
                    reftype: data?.reftype || "-",
                    userTag: data?.userTag || "-",
                    websiteUrl: data?.websiteUrl || "-",
                    charOrigin: data?.charOrigin || "-",
                    remark: data?.remark || "-",
                    createdDate: data?.createdDate || "-",
                    requestedDate: moment(new Date()).format('YYYY-MM-DD hh:mm:ss A'),
                })
                onClose()
            } catch (error) {
                console.log(error)
                alert('Failure in saving data, contact admin');
            }
        }
    }

    return (
        <Box 
            sx={{
                width: '50vh',
                height: '85vh',
            }}
        >
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container>
                    <Grid item xs={12}>
                        <Stack direcion='column' spacing={1} sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Typography variant='h6'>
                                {`Edit Data of ${editData.userName}`}
                            </Typography>
                            <Typography variant='body1'>
                                Image Preview
                            </Typography>
                            {editData.userPicUrl !== null &&
                                <img 
                                    src={editData?.userPicUrl} 
                                    alt='Profile Pic' 
                                    style={{
                                        width:'10rem', 
                                        height:'10rem', 
                                        borderRadius:'50%'
                                    }}
                                />
                            }
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <Divider style={{ height:'1rem'}} />
                            <RHFTextField name="userName" placeholder="Name" />
                            <RHFTextField name="userPicUrl" placeholder="Profile Pic" minRows={2} multiline />
                            <Stack direction='row' spacing={2}>
                                <Controller
                                    name='reftype'
                                    control={control}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <RHFSelect
                                            {...field}
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
                            <RHFTextField name="websiteUrl" placeholder="Website URL" showLabel={true}/>
                            <RHFTextField name="charOrigin" placeholder="Character Origin" showLabel/>
                            <RHFTextField name="remark" placeholder="Remark" showLabel />
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Edit Data
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
                
            </FormProvider>
        </Box>
    )
}
