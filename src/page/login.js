import React, { useContext, useMemo } from 'react'
import FormProvider from '../component/hook-form/FormProvider'
import { useForm } from 'react-hook-form'
import { RHFTextField } from '../component/hook-form'
import { LoadingButton } from '@mui/lab'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import AuthContext from '../AuthProvider/AuthGuard'
import { useNavigate } from 'react-router'
import { PATH_MAIN } from '../routes/paths'

export default function Login() {

    const {dispatch} = useContext(AuthContext)

    const navigate = useNavigate()

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
    } = methods

    const onSubmit =  async (data) => {
        const { email, password } = data
        try{
            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch({type:'LOGIN', payload: user})
                navigate(PATH_MAIN.datalist)
            })
            .catch((error) => {
                alert('Fail')
            });
        } catch (err) {
            console.error('Fail', err)
        }
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFTextField name="email" label="Email" />
            <RHFTextField name="password" label="Password" />
            <LoadingButton type="submit" variant="contained">
                Login
            </LoadingButton>
        </FormProvider>
    )
}
