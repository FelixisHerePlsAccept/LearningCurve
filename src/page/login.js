import React, { useContext, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Box, IconButton, InputAdornment, Stack, Typography } from '@mui/material'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import MediaContext from '../Provider/MediaProvider/MediaProvider'
import { auth, db } from '../firebase'
import AuthContext from '../Provider/AuthProvider/AuthGuard'
import { RHFTextField } from '../component/hook-form'
import FormProvider from '../component/hook-form/FormProvider'
import { PATH_MAIN } from '../routes/paths'

export default function Login() {

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)

    const {dispatch} = useContext(AuthContext)
    const {isMobile} = useContext(MediaContext)

    console.log(isMobile ? 'isMobile' : 'isNotMobile')

    const defaultValue = useMemo (
        () => ({
            email: '',
            password: '',
        }),
        []
    )

    const methods = useForm({
        defaultValue
    })

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const onSubmit =  async (data) => {
        const { email, password } = data
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user.uid
            const userDoc = await getDoc(doc(db, "userData", user))
            const userData = userDoc.data()
            dispatch({type:'LOGIN', payload: userData})
            await new Promise((resolve) => {
                window.location.reload();
                resolve();
            });
            navigate(PATH_MAIN.datalist);
        } catch (error) {
            console.error('Fail', error)
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
                        <Stack spacing={2} sx={{width:'50%', margin:'auto'}}>
                            <Typography variant='h4' fontWeight={700} textAlign={'center'}>
                                Bonjour Monsieur
                            </Typography>
                            <Typography variant='h6' fontWeight={500} textAlign={'center'}>
                                Login
                            </Typography>
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
                            <LoadingButton type="submit" variant="contained" loading={ isSubmitting }>
                                Login
                            </LoadingButton>
                            <Stack direction='row' sx={{justifyContent:'center', alignItems:'center'}} spacing={1}>
                            <Typography variant='subtitle2'>
                                    Not a gooner?
                                </Typography>
                                <a href='/signup'>
                                    <Typography variant='subtitle2' >
                                        Goon first                                        
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
                    <Stack spacing={2} sx={{width:'50%', margin:'auto'}}>
                        <Typography variant='h4' fontWeight={700} textAlign={'center'}>
                            Bonjour Monsieur
                        </Typography>
                        <Typography variant='h6' fontWeight={500} textAlign={'center'}>
                            Login
                        </Typography>
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
                        <LoadingButton type="submit" variant="contained" loading={ isSubmitting }>
                            Login
                        </LoadingButton>
                        <Stack direction='row' sx={{justifyContent:'center', alignItems:'center'}} spacing={1}>
                        <Typography variant='subtitle2'>
                                Not a gooner?
                            </Typography>
                            <a href='/signup'>
                                <Typography variant='subtitle2'>
                                    Sign here
                                </Typography>
                            </a>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </FormProvider>
    )
}