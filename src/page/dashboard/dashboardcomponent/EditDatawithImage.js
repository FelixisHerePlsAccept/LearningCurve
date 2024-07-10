import * as Yup from 'yup'
import PropType from 'prop-types'
import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormProvider from '../../../component/hook-form/FormProvider'
import { Box, Button, Stack, Typography } from '@mui/material'
import { RHFTextField, RHFUploadBox } from '../../../component/hook-form'
import { LoadingButton } from '@mui/lab'

EditDatawithImage.propType = {
    passedData: PropType.array,
    onClose: PropType.func,
    onUpdate: PropType.func,
}

export default function EditDatawithImage({passedData, onClose, onUpdate}) {

    const [editdata, setEditData] = useState([]);
    const [imagepublic, setImagePublic] = useState();
    const [file, setFile] = useState();
    const [imageChange, setImageChange] = useState(false);

    const editSchema = Yup.object().shape({
        ref: Yup.number().required('REQUIRED'),
        name: Yup.string().required('REQUIRED'),
    })

    const defaultValue = useMemo(
        () => ({
            ref: editdata?.ref_id || null,
            name: editdata?.data_name || '',
            imagename: editdata?.data_imagename || '',
            rowid: editdata?.data_rowid || null,
        }),
        [editdata]
    )

    useEffect (() => {
        setEditData(passedData)
        setImagePublic(passedData.data_imagename)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const methods = useForm({
        resolver: yupResolver(editSchema),
        defaultValue,
    })

    const {
        reset,
        // control,
        watch,
        handleSubmit,
        setValue,
        formState: {isSubmitting},
    } = methods;

    useEffect (() => {
        reset(defaultValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[editdata])

    const newImage = watch('image')
    console.log('newImage', newImage)

    const onSubmit = (data) => {
        console.log('data', data, 'file', file, 'imagechange', imageChange);
        const formdata = new FormData();
        formdata.append('imagechange', imageChange ? 'yes' : 'no')
        formdata.append('deleteimage', data.imagename)
        formdata.append('name', data.name)
        formdata.append('image', file)
        formdata.append('rowid', data.rowid)
        axios.post('https://backend-r2i9.onrender.com/EditImageChange', formdata)
        .then()
        .catch(err => console.error(err))
        onClose();
        onUpdate();
    }

    const handleDrop = (acceptedFile) => {
        setImageChange(true)
        const file = acceptedFile[0];
        setFile(file)
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            console.log('previewUrl', previewUrl)
            setValue('image', previewUrl, {shouldValidate:true})
        }
    }

    const bringbackOldImage = () => {
        setImageChange(false)
        setFile()
        setValue('image', '', {shouldValidate:true})
        console.log('imagepublic')
    }

    console.log(imageChange)

    return (
        <Box sx={{width:'50vh', height:'85vh',}}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={'column'} spacing={2} justifyContent={'center'} alignItems={'center'}>
                    <Typography variant='h5' sx={{textTransform:'capitalize'}}>
                        Edit Image Info of <strong>{editdata?.data_name}</strong>
                    </Typography>
                    <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <Stack direction={'column'}>
                            <img 
                                src={!imageChange ? `https://backend-r2i9.onrender.com/images/${imagepublic}` : newImage } 
                                alt={'does not exist'} 
                                style={{
                                    width:'20rem', 
                                    height:'20rem', 
                                    borderRadius:'2rem', 
                                    border:'1px solid black'
                                }} 
                            />
                            {imageChange && (
                                <Button type='button' onClick={bringbackOldImage}>Reset Image</Button>
                            )}
                        </Stack>
                    </Box>
                    <RHFTextField
                        name='name'
                        placeholder='Image Title'
                    />
                    <Box 
                        sx={{
                            display:'flex',
                            justifyContent:'center',
                            alignItems:'center',
                            borderRadius:'2rem',
                            border:'1px dashed black',
                            width:'50%',
                        }}
                    >
                        <Stack direction={'column'}>
                            <Typography variant='caption' sx={{color:'red'}} textAlign={'center'}>
                                Click the box below {<br/>} to change image
                            </Typography>
                            <RHFUploadBox
                                name="image"
                                maxSize={5000000}
                                onDrop={handleDrop}
                                sx={{
                                    width:'10rem',
                                    height:'10rem',
                                }}
                            />
                        </Stack>
                    </Box>
                    <LoadingButton loading={isSubmitting} variant='contained' fullWidth type='submit'>
                        Edit Data!
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </Box>
    )
}
