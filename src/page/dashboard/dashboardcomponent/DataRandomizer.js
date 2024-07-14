import PropType from 'prop-types'
import { Box, Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Wheel } from 'react-custom-roulette'

DataRandomizer.propTypes = {
    passedData: PropType.array,
    onFinishSpin: PropType.func,
    setWinnerData: PropType.func,
}

export default function DataRandomizer({ passedData, onFinishSpin, setWinnerData }) {

    const [wheelData, setWheelData] = useState([])
    const [mustSpin, setMustSpin] = useState(false)
    const [prizeNum, setPrizeNum] = useState(null)

    useEffect(() => {
        setWheelData(passedData)
    },[passedData]) //render once

    const handleClick = () => {
        const winner = Math.ceil(Math.random() * wheelData.length)
        setPrizeNum(winner)
        setWinnerData(wheelData[winner])
    }

    return (
        <>
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            {wheelData.length > 0 ? (
                <Stack direction='column' spacing={2}>
                    <Wheel
                        disableInitialAnimation={true}
                        mustStartSpinning={mustSpin}
                        data={wheelData}
                        prizeNumber={prizeNum}
                        spinDuration={.25}
                        radiusLineWidth={0}
                        fontSize={10}
                        textDistance={60}
                        outerBorderWidth={1}
                        outerBorderColor='red'
                        backgroundColors={[
                            '#FE2C54',
                            '#FF66CC',
                            '#FFC0CB',
                        ]}
                        onStopSpinning={()=>{
                            setMustSpin(false);
                            onFinishSpin();
                        }}
                    />
                    <Button 
                        disabled={mustSpin ? true : false}
                        variant='contained'
                        onClick={() => {
                            handleClick()
                            setMustSpin(true)
                        }}
                    >
                        Spin!
                    </Button>
                </Stack>
            ): (
                null
            )}
        </Box> 
        </>
    )
}
