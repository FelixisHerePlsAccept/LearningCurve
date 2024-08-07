import { Box, IconButton } from '@mui/material'
import React, { useContext } from 'react'

import ThemeContext from '../Provider/ThemeProvider/ThemeProvider'
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'


export default function FixedButton() {

    const {currentTheme, dispatch} = useContext(ThemeContext)

    const Style = {
        width: '1.5rem',
        height: '1.5rem',
    }

    const handleClick = () => {
        const current = currentTheme;
        if (current === 'light') {
            dispatch({type: 'DARK'}) // if theme is light, clicking will change theme to dark
        } else {
            dispatch({type: 'LIGHT'})
        }
    }
    console.log('currentTheme:',currentTheme)

    return (
        <Box sx={{ position:'fixed', bottom: 20, right: 20 }} >
            <IconButton size='medium' sx={{ border:'1px solid', bgcolor: currentTheme === 'dark' ? 'white' : 'yellow', '&:hover': {bgcolor: currentTheme === 'dark' ? 'lightblue' : 'orange'} }} onClick={handleClick}>
                {currentTheme === 'dark' ? <MoonIcon style={Style} /> : <SunIcon style={Style} />}
            </IconButton>
        </Box>
    )
}