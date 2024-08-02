import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import PropType from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import FormProvider from '../../../component/hook-form/FormProvider'
import { RHFTextField } from '../../../component/hook-form'
import { Box, Grid, Stack, Typography } from '@mui/material'

EditData.propTypes = {
    data: PropType.object,
    onClose: PropType.func
}

export default function EditData({ data, onClose }) {
    console.log(data)

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
            userName: data?.userName || '',
            userPicUrl: data?.userPicUrl || '',
            reftype: data?.reftype || '',
            userTag: data?.userTag || '',
            websiteUrl: data?.websiteUrl || '',
            charOrigin: data?.charOrigin || '',
            remark: data?.remark || '',
        }),
        [data]
    )

    const methods = useForm({
        resolver: yupResolver(EditSchema),
        defaultValue
    })

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    useEffect(() => {
        reset(defaultValue)
    }, [defaultValue, reset])

    const onSubmit = async (data) => {
        console.log(data)
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
                        <Stack direcion='column' spacing={2} sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <Typography variant='h5'>
                                Image Preview
                            </Typography>
                            {data.userPicUrl !== null &&
                                <img 
                                    src={data?.userPicUrl} 
                                    alt='Profile Pic' 
                                    style={{
                                        width:'20rem', 
                                        height:'20rem', 
                                        borderRadius:'50%'
                                    }}
                                />
                            }
                        </Stack>
                    </Grid>
                </Grid>
                
            </FormProvider>
        </Box>
    )
}
