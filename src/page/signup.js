import * as Yup from 'yup'
import React, { useContext, useMemo, useState } from 'react'
import FormProvider from '../component/hook-form/FormProvider'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, Stack, Typography } from '@mui/material'
import { RHFTextField } from '../component/hook-form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import MediaContext from '../Provider/MediaProvider/MediaProvider'
import { PATH_MAIN } from '../routes/paths'
import { useNavigate } from 'react-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

export default function Signup() {

    const navigate = useNavigate()

    const {isMobile} = useContext(MediaContext)
    const [showPassword, setShowPassword] = useState(false)

    const SignUpSchema = Yup.object().shape({
        username: Yup.string().required('Name is required'),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
        secretKey: Yup.string().required('Secret key is required'),
    })

    const defaultValues = useMemo(
        () => ({
            username: '',
            email: '',
            password: '',
            secretKey: '',
        })
        ,[]
    )

    const methods = useForm({
        resolver: yupResolver(SignUpSchema),
        defaultValues,
    })

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const onSubmit = async (data) => {
        try {
            const userCreate = await createUserWithEmailAndPassword(auth, data.email, data.password)
            .catch(() => alert('Failure in log in, contact admin'))
            const userDocRef = doc(db, 'userData', userCreate.user.uid)
            await setDoc(userDocRef, {
                userName: data.username,
                userEmail: data.email,
                userRole: 'User',
            })
            alert('User created successfully')
            navigate('/login')
            reset(defaultValues)
        } catch (error) {
            console.log(error)
        }
    }

    if(isMobile){
        return (
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Box 
                    sx={{
                        display:'flex',
                        justifyContent:'center',
                        alignItems:'center',
                        width:'100%', 
                        height:'100vh', 
                        bgcolor:'red'
                    }}
                >
                    <Box 
                        sx={{
                            height:'auto',
                            width:'80%',
                            bgcolor:'white',
                            p:'1rem 0 1rem 0',
                            borderRadius:'1rem'
                        }}
                    >
                        <Stack spacing={1} sx={{ width:'60%', margin:'auto'}}>
                            <Typography variant='h4' fontWeight={700} textAlign={'center'}>
                                Hi, Gooner
                            </Typography>
                            <Typography variant='h6' fontWeight={500} textAlign={'center'}>
                                Sign Up
                            </Typography>
                            <RHFTextField name="username" showLabel={true} />
                            <RHFTextField name="email" showLabel={true} />
                            <RHFTextField 
                                name="password" 
                                type={showPassword ? 'text' :  'password'}
                                autoComplete='off'
                                showLabel={true}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                                {showPassword ? <EyeIcon style={{width:'1.5rem', height:'1.5rem'}} /> : <EyeSlashIcon style={{width:'1.5rem', height:'1.5rem'}} />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <RHFTextField name="secretKey" showLabel={true} />
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Create Account
                            </LoadingButton>
                            <Stack direction='row' sx={{ justifyContent:'center', alignItems:'center'}} spacing={1}>
                                <Typography variant='subtitle2'>
                                    Already gooning?
                                </Typography>
                                <a href='/login'>
                                    <Typography variant='subtitle2'>
                                        Morb here
                                    </Typography>
                                </a>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </FormProvider>
        )
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box 
                sx={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    width:'100%', 
                    height:'100vh', 
                    bgcolor:'red'
                }}
            >
                <Box 
                    sx={{
                        height:'auto',
                        width:'30%',
                        bgcolor:'white',
                        p:'1rem 0 1rem 0',
                        borderRadius:'1rem'
                    }}
                >
                    <Stack spacing={2} sx={{ width:'60%', margin:'auto'}}>
                        <Typography variant='h4' fontWeight={700} textAlign={'center'}>
                            Hi, Gooner
                        </Typography>
                        <Typography variant='h6' fontWeight={500} textAlign={'center'}>
                            Sign Up
                        </Typography>
                        <RHFTextField name="username" showLabel={true} />
                        <RHFTextField name="email" showLabel={true} />
                        <RHFTextField 
                            name="password" 
                            type={showPassword ? 'text' :  'password'}
                            autoComplete='off'
                            showLabel={true}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                            {showPassword ? <EyeIcon style={{width:'1.5rem', height:'1.5rem'}} /> : <EyeSlashIcon style={{width:'1.5rem', height:'1.5rem'}} />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <RHFTextField name="secretKey" showLabel={true} />
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Create Account
                        </LoadingButton>
                        <Stack direction='row' sx={{ justifyContent:'center', alignItems:'center'}} spacing={1}>
                            <Typography variant='subtitle2'>
                                Already gooning?
                            </Typography>
                            <a href='/login'>
                                <Typography variant='subtitle2'>
                                    Morb here
                                </Typography>
                            </a>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </FormProvider>
    )
}
