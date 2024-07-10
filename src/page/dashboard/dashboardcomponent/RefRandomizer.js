import PropType from 'prop-types'
import { Box, Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Wheel } from 'react-custom-roulette';

RefRandomizer.propTypes = {
    reflist: PropType.array,
    setWinnerRef: PropType.func,
    onFinishSpin: PropType.func,
}

export default function RefRandomizer({ reflist, setWinnerRef, onFinishSpin }) {

    const [mustSpin, setMustSpin] = useState(false)
    const [ref, setRef] = useState([]);
    const [prizeNum, setPrizeNum] = useState(null);

    useEffect (() => {
        setRef(reflist)
    }, [reflist]) //render once

    console.log('ref', ref)

    const handleClick = () => {
        setMustSpin(true)
        const winner = Math.ceil(Math.random() * ref.length)
        setPrizeNum(winner)
        setWinnerRef(ref[winner].option)
    }

    return (
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            {ref.length > 0 ? (
                <Stack direction='column' spacing={2}>
                    <Wheel
                        disableInitialAnimation={true}
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNum}
                        data={ref}
                        spinDuration={.25}
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
                    <Button variant='contained' disabled={mustSpin ? true : false} onClick={handleClick}>
                        Spin!
                    </Button>
                </Stack>
            ):(
                null
            )}
        </Box>
    )
}
