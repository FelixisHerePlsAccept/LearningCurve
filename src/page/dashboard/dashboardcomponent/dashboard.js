import { Breadcrumbs, Button, Container, Grid, TextField, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import '../dashboard.css'
import { RHFTextField } from '../../../component/hook-form';
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '../../../component/hook-form/FormProvider';

export default function Dashboard() {
    const [ imgurl, setImgUrl ] = useState('');

    const defaultValue = useMemo(
        ()=> ({
            name1: ''
        }),
        []
    )

    const methods = useForm({
        // resolver: yupResolver(newSchema),
        defaultValue,
    })

    const {
        // reset,
        // trigger,
        // watch,
        // control,
        // setValue,
        handleSubmit,
        // formState: {isSubmitting},
    } = methods;

    const onSubmit = (data) => {
        console.log(data)
    }

  return (
    <>
        <Helmet>
            <title>Dashboard</title>
        </Helmet>
        <Breadcrumbs>
            <Typography variant='inherit'>
                Dashboard
            </Typography>
        </Breadcrumbs>
        <Container sx={{pt:'1rem'}} className='main_bg_color'>
            <Typography className='typo_color'>
                Dashboard component here...
            </Typography>
            <div className='typo_color'>
                Hi
            </div>
            <Grid container>
                <Grid item xs={12}>
                    {imgurl !== '' ?
                        <Button onClick={() => setImgUrl('')}>
                            Reset Field
                        </Button>
                    :
                    (
                        null
                    )} 
                </Grid>
                <Grid item xs={12}>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            sx={{backgroundColor:'white'}}
                            value={imgurl}
                            onChange={(event) => {
                                let url = event.target.value;
                                url = url.replace(/'/g, "");
                                url = url.replace(/,/g,"");
                                setImgUrl(url);
                            }}
                        />
                        <RHFTextField
                            className='RHF_class'
                            name='name1'
                        />
                    </FormProvider>
                </Grid>
                <Grid item xs={12}>
                    <img src={imgurl} alt='does not work' class='typo_color' />
                </Grid>
            </Grid>
        </Container>
    </>
  )
}
