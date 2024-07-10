import * as Yup from 'yup'
import { Box, Button, Card, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import PropType from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../../component/hook-form/FormProvider';
import { RHFCheckbox, RHFRadioGroup, RHFSelect, RHFTextField } from '../../../component/hook-form';
import { LoadingButton } from '@mui/lab';
import { bgcolor } from '@mui/system';

EditData.propType = {
    passedData: PropType.array,
    onClose: PropType.func,
    onUpdate: PropType.func,
}

export default function EditData({ passedData, onClose, onUpdate}) {
    const [editdata, setEditData] = useState([]);
    const [listRef, setListRef] = useState([]);
    const [imageURL, setImageURL] = useState('');

    console.log('initial entrance', imageURL, passedData.data_rowid)

    const editSchema = Yup.object().shape({
        ref: Yup.number().required("REQUIRED"),
        name: Yup.string().required("REQUIRED"),
        url: Yup.string().required("REQUIRED"),
        origin: Yup.string().nullable(true),
        tag: Yup.string().nullable(true),
    })

    const defaultValue = useMemo(
        () => ({
            ref: editdata?.ref_id || null,
            name: editdata?.data_name || '',
            url: editdata?.data_url || '',
            origin: editdata?.data_origin || '',
            rowid: editdata?.data_rowid || '',
            tag: editdata?.data_tag || '',
            dateCreated: editdata?.data_dateCreated || '',
        }),
        [editdata]
    )

    const methods = useForm({
        resolver: yupResolver(editSchema),
        defaultValue,
    })

    const {
        watch,
        reset,
        control,
        handleSubmit,
        setValue,
        formState: {isSubmitting},
    } = methods;

    const reftype = watch('ref');

    const tagtype = watch('tag');

    useEffect(() => {
        setEditData(passedData);
        setImageURL(passedData.data_url)
    }, [])

    useEffect (() => {
        reset(defaultValue)
    }, [editdata])

    useEffect(() => {
        fetch('http://localhost:1000/reference')
        .then(res=>res.json())
        .then(data=>{
            setListRef(data)
        })
        .catch(err => console.error(err))
    }, [])

    const RADIO_TAG = [
        {label: 'SFW', value: 'SFW'},
        {label: 'NSFW', value: 'NSFW'},
        {label: 'Borderline', value:'Borderline'}
    ]

    const onSubmit = async (data) => {
        if(data.ref !== 8){
            try {
                const response = await fetch('http://localhost:1000/modifyData_Table', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify ({
                        ref: data.ref,
                        rowid: data.rowid,
                    })
                })
                if (response.ok) {
                    console.log('First Fetch success');
                    try {
                        const response2 = await fetch('http://localhost:1000/modifydatalist', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify ({
                                ref: data.ref,
                                name: data.name,
                                url: data.url,
                                tag: data.tag,
                                origin: data.origin,
                                rowid: data.rowid,
                            })
                        })
                        if (response2.ok) {
                            console.log('SECOND FETCH success')
                            onClose();
                            onUpdate();
                        }
                        else {
                            console.log('FAILED ENTRANCE 2ND FETCH')
                        }
                    }
                    catch (error) {
                        console.error('2ND FETCH ERROR: ', error)
                    }
                }
                else {
                    console.log('FAILED ENTRANCE')
                }
            } catch (error) {
                console.error('FETCH ERROR: ', error)
            }
        }
        else{
            console.log('data.ref: ',data.ref)
        }
    }

    return (
        <>
        <Box
            sx={{
                width:'50vh',
                height:'85vh',
            }}
        >
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={'column'} spacing={1}>
                    <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <Typography variant='h5' sx={{textTransform:'capitalize'}}>
                            Edit data of <strong>{editdata.data_name}</strong>
                        </Typography>
                    </Box>
                    <Box>
                        {editdata.ref_id !== 3 ? 
                        (
                            <Stack direction="column" sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                <Typography>
                                    Preview of Image
                                </Typography>
                                <img src={imageURL} alt={editdata.data_name} style={{width:'15rem', height:'15rem', borderRadius:'50%', border:'1px solid black'}} />
                            </Stack>
                        )
                        :
                            null
                        }
                    </Box>
                    <Controller
                        name="ref"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                            <RHFSelect
                                {...field}
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
                        {/* <Controller
                             name='tag'
                             control={control}
                             defaultValue={null}
                             render={({ field }) => (
                                 <RHFSelect
                                     {...field}
                                     placeholder="Tag"
                                     label={tagtype ? null : 'Tag'}
                                 >
                                     <MenuItem value={'SFW'}>SFW</MenuItem>
                                     <MenuItem value={'NSFW'}>NSFW</MenuItem>
                                     <MenuItem value={'Borderline'}>Borderline</MenuItem>
                                    
                                 </RHFSelect>
                             )}
                         /> */}
                        <Card elevation={0} sx={{p:'.5rem', border:'1px solid rgb(200,200,200)'}}>
                            <Stack direction={'row'} spacing={4}>
                                <Typography sx={{display:'flex', justifyContent:'left', alignItems:'center'}}>
                                    Tag: 
                                </Typography>
                                <Controller
                                    name='tag'
                                    control={control}
                                    defaultValue={null}
                                    render = {({ field }) => (
                                        <RHFRadioGroup
                                            {...field}
                                            options={RADIO_TAG}
                                            row
                                        />
                                    )}
                                />
                                
                            </Stack>
                        </Card>

                    <RHFTextField
                        name="name"
                        placeholder="Name"
                    />
                    <RHFTextField
                        name="url"
                        placeholder="Picture/Website URL"
                        multiline
                        minRows={3}
                        onChange={(event)=>{
                            setImageURL(event.target.value);
                            setValue('url', event.target.value, {shouldValidate: true})
                        }
                        }
                    />
                    <RHFTextField
                        name='origin'
                        placeholder='Origin of character'
                    />
                    <LoadingButton type="submit" variant='contained' loading={isSubmitting}>
                        Modify Data
                    </LoadingButton>
                </Stack>
            </FormProvider>
        </Box>
        </>
    )
}
