import { Box, Breadcrumbs, Container, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROOT_DASHBOARD } from '../../../routes/route'
import { Helmet } from 'react-helmet-async'
import { Wheel } from 'react-custom-roulette'

export default function Profile() {

    const [wheeldata, setWheelData] = useState([])

    useEffect (() => {
        fetch('http://localhost:1000/view')
        .then(res => res.json())
        .then(data => setWheelData(data))
        .catch(err => console.error(err))
    }, [])

    const wheelArray = wheeldata.filter(obj => obj.ref_id === 8)

    const filteredArray = wheelArray.map((data,i) => ({
        id: i + 1,
        option: data.data_name,
    }))

    return (
        <>
            <Helmet>
                <title>Profile</title>
            </Helmet>
            <Breadcrumbs separator=' | '>
                <Link to={`${ROOT_DASHBOARD}/mainpage/dashboard`} style={{textDecoration:'none', color:'black'}}>
                    <Typography variant='inherit'>
                        Dashboard
                    </Typography>
                </Link>
            <Typography variant='inherit'>
                Profile
            </Typography>
            </Breadcrumbs>
            <Container sx={{pt:'1rem'}}>
                <Typography>
                    Profile here...
                </Typography>
                {wheeldata.length > 0 ? (
                    <Wheel
                        mustStartSpinning={false}
                        data={filteredArray}
                        prizeNumber={1}
                        radiusLineWidth={0}
                    />
                ):
                null}
            </Container>
        </>
    )
}