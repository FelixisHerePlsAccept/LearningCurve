import PropType from 'prop-types'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Switch } from '@mui/material'
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
    const [filtertag, setFilterTag] = useState('');

    useEffect(() => {
        setWheelData(passedData)
    },[passedData]) //render once

    const filtered_data = wheelData?.filter((data) => {
        // Check if data.data_tag exists and includes the filtertag
        if(filtertag) return data.data_tag === filtertag;
        return data.data_tag;
    });

    const handleClick = () => {
        const winner = Math.ceil(Math.random() * filtered_data.length)
        setPrizeNum(winner)
        setWinnerData(filtered_data[winner])
    }

    const handleTag = (event) => {
        setFilterTag(event.target.value)
    }

    const TAG_OPTION = ['NSFW', 'SFW', 'Borderline']

    console.log('wheelData', filtered_data)

    return (
        <>
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            {filtered_data.length > 0 ? (
                <Stack direction='column' spacing={2}>
                    {wheelData.ref_id !== 6 || wheelData.ref_id !== 7 || wheelData.ref_id !== 8 ? (
                        <FormControl>
                            <InputLabel>Filter result</InputLabel>
                            <Select value={filtertag} onChange={handleTag}>
                                <MenuItem value=''>No Filter</MenuItem>
                                {TAG_OPTION && TAG_OPTION.map((tag) => (
                                    <MenuItem value={tag}>{tag}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ): null}
                    <Wheel
                        disableInitialAnimation={true}
                        mustStartSpinning={mustSpin}
                        data={filtered_data}
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
