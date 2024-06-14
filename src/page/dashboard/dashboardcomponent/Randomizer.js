import PropType from 'prop-types';
import { Box, Breadcrumbs, Button, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Wheel } from 'react-custom-roulette'
import { Helmet } from 'react-helmet-async';
import { AnimeChar, AnimePic, AnimeTitle, Artist, ArtistUrl, Cosplayer, CosplayerURL, Pose, PoseUrl } from '../mock/artist';
import { Link } from 'react-router-dom';
import { ROOT_DASHBOARD } from '../../../routes/route';

const reference = [
    {
        id:1,
        option:'Artist'
    },
    {
        id:2,
        option:'Cosplayer'
    },
    {
        id:3,
        option:'Pose Reference'
    },
    {
        id:4,
        option:'Game Character'
    },
    {
        id:5,
        option:'Specific Body Parts'
    },
    {
        id:6,
        option:'Free Draw'
    },
    {
        id:7,
        option:'Anime Character'
    },
    {
        id:8,
        option: 'Vtuber'
    },
];

//=========== ARTIST =============
const artistName = Artist;
const artistUrl = ArtistUrl;
const ArtistData = Array.from({length: Artist.length },(_,index) => ({
    id: index+1,
    option: artistName[index],
    url: artistUrl[index],
}));

//=========== COSPLAYER =============
const cosplayer = Cosplayer;
const cosplayerUrl = CosplayerURL;
const CosplayerData = Array.from({ length: Cosplayer.length },(_,index) => ({
    id: index+1,
    option: cosplayer[index],
    url: cosplayerUrl[index],
}));

//======== POSE REFERENCE ============
const pose = Pose;
const poseurl = PoseUrl;
const PoseData = Array.from({ length: Pose.length }, (_,index) => ({
    id: index+1,
    option: pose[index],
    url: poseurl[index]
}));

// ========== ANIME ==================
const anime = AnimeChar;
const pic = AnimePic;
const title = AnimeTitle;
const AnimeData = Array.from({ length: AnimeChar.length }, (_,index) => ({
    id: index + 1,
    option: anime[index],
    url: pic[index],
    title: title[index],
}))

export default function Randomizer() {

    const [ isSpin, setIsSpin ] = useState(false);

    const [ winnerNum, setWinnerNum ] = useState(0);

    const [ winnerPrint, setWinnerPrint ] = useState('');

    const [ winnerPrint2, setWinnerPrint2 ] = useState('');

    const [ revealButton, setRevealButton ] = useState(false);

    const [ revealAnswer, setRevealAnswer ] = useState(false);

    const [ passedData, setPassedData ] = useState([]);

    const [ countdown, setCountdown ] = useState(null);

    const [ allowRedirect, setAllowRedirect ] = useState(true);

    const [ url, setURL ] = useState('');

    console.log(AnimeData[0], AnimeData.length)

    useEffect (() => {
        const reftype = winnerPrint;
        if (revealButton) {
            switch(reftype) {
                default:
                    return;
                case 'Artist':
                    setPassedData(ArtistData);
                    break;
                case 'Cosplayer':
                    setPassedData(CosplayerData);
                    break;
                case 'Pose Reference':
                    setPassedData(PoseData);
                    break;
            }
        }
    }, [ winnerPrint, revealButton ] )

    useEffect(() => { 
        let countdownInterval = null;
        if(revealAnswer) {
            setWinnerPrint2(winnerPrint2);
            const data = passedData.find((name) => name.option === winnerPrint2);
            setURL(data.url);
            console.log(data)
            console.log('WinnerPrint2',winnerPrint2)
            if (countdown > 0) {
                countdownInterval = setInterval(() => {
                    setCountdown(countdown-1);
                }, 1000)
            }
            else if (countdown === 0 && allowRedirect) {
                window.open(data.url,'_blank');
            }
            return () => clearInterval(countdownInterval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown])

    const handleClick = () => {
        setIsSpin(true);
        // const Winner = Math.floor(Math.random() * reference.length);
        const Winner = 2;
        setWinnerNum(Winner);
        setWinnerPrint(reference[Winner].option);
    }

    const handlereset = () => {
        setIsSpin(false);
        setWinnerNum(0);
        setWinnerPrint('');
        setWinnerPrint2('');
        setRevealAnswer(false);
        setRevealButton(false);
        setPassedData('');
        setCountdown(null);
        setAllowRedirect(true);
        setURL('');
    }

    return (
        <>
            <Helmet>
                <title>Randomizer</title>
            </Helmet>
            <Breadcrumbs sx={{pb:'2rem'}} separator=" | ">
                <Link to={`${ROOT_DASHBOARD}/mainpage/dashboard`} style={{textDecoration:'none', color:'black'}}>
                    <Typography variant='inherit'>
                        Dashboard
                    </Typography>
                </Link>
                <Typography>
                    Randomizer
                </Typography>
            </Breadcrumbs>
            {/* First wheel to render */}
            <Grid container sx={{border:'1px solid black'}}>
                { revealAnswer ?
                (
                <Grid item xs={12} md={12} sx={{p:'1rem'}}>
                    <Box sx={{height:'10vh', width:'100%',mb:'5rem'}}>
                        <Typography variant='h5'>
                            {`The drawing reference type = ${winnerPrint}`}
                            <br/>
                            <Stack direction={'row'}>
                                <Typography variant='h5'>
                                    {`The ${winnerPrint} to follow is `} &nbsp;
                                </Typography>
                                <a href={url} target='_blank' rel='noopener noreferrer' style={{textDecoration:'none'}}>
                                    @{winnerPrint2}
                                </a> 
                            </Stack>
                        </Typography>
                        {countdown !== 0 ? 
                        <>
                            <Stack direction='column'>
                                {allowRedirect ? <Typography>Redirecting in <strong>{countdown}</strong></Typography> : null}
                                {countdown !== 0 && <Button sx={{width:'fit-content'}} variant='contained' onClick={()=>{setAllowRedirect(false);setCountdown(0)}}>Stop Redirect!</Button>}
                            </Stack>
                        </> 
                        : 
                        <Typography>Happy Drawing👋</Typography>
                        }
                        {countdown === 0 && <Button variant='contained' sx={{bgcolor:'reset',opacity:'.5'}} onClick={handlereset}>Reset Wheel!</Button> }
                    </Box>
                </Grid>
                ):
                (
                    null
                )
                }
                <Grid item xs={12} md={revealButton ? 6 : 12} align="center">
                    <Wheel
                        spinDuration={.3}
                        disableInitialAnimation={true}
                        backgroundColors={['red','#f6412d','#ff5607','#ff9800','#ffc100','#ffec19']}
                        mustStartSpinning={isSpin}
                        prizeNumber={winnerNum}
                        data={reference}
                        fontSize={15}
                        radiusLineWidth={2}
                        outerBorderWidth={2}
                        textDistance={60}
                        onStopSpinning={()=>{
                            setIsSpin(false);
                            setRevealButton(true);
                            setRevealAnswer(false);
                        }}
                    />
                    {console.log(winnerNum)}
                    <Box sx={{p:'2.5rem'}}>
                        <Button variant='contained' onClick={handleClick} disabled={revealButton ? true : false}>What to Draw?</Button>
                    </Box>
                </Grid>
                {/* Second Wheel render here */}
                {revealButton ? (
                    <Grid item xs={12} md={6} align="center">
                        <SecondWheel 
                            
                            passData={passedData}
                            setWinnerPrint2={setWinnerPrint2}
                            setRevealAnswer={setRevealAnswer}
                            setCountDown={setCountdown}
                        />
                    </Grid>
                )
                :
                (
                    null
                )}
            </Grid>
        </>
    )
}

// Second Wheel function
// ===================================================================================== //

SecondWheel.propTypes = {
    
    passData: PropType.array,
    setWinnerPrint2: PropType.func,
    setRevealAnswer: PropType.func,
    setCountDown: PropType.func,
}

function SecondWheel({ passData, setWinnerPrint2, setRevealAnswer, setCountDown }) {

    console.log('PassedData',passData)

    const [ revealWheel, setRevealWheel ] = useState(false);

    const [ isSpin, setIsSpin ] = useState(false);

    const [ isSpinning, setIsSpinning ] = useState(false);

    const [ winnerNum, setWinnerNum ] = useState(0);

    const [ winnerPrint, setWinnerPrint ] = useState('');

    const handleReveal = () => {
        setTimeout(()=>{
            setIsSpin(true);
        }, 500)
        setRevealWheel(true);
        const Winner = Math.floor(Math.random() * passData.length);
        setWinnerNum(Winner);
        const newWinnerPrint = passData[Winner].option;
        setWinnerPrint(newWinnerPrint);
        setWinnerPrint2(newWinnerPrint);
    }

    console.log(winnerPrint)

    return (
        <>
            {!revealWheel ?
            (
                
                <Button variant='contained' sx={{bgcolor:'lightgreen',position:'absolute',top:'27vh',left:'74.5vw', borderRadius:'50%', height:'7rem', width:'7rem'}} onClick={handleReveal}>
                    Reveal the second circle
                </Button>
                
            )
            :
            (
                <>
                <Box sx={{alignItems:'center'}}>
                <Wheel
                    disableInitialAnimation={true}
                    spinDuration={.3}
                    mustStartSpinning={isSpin}
                    prizeNumber={winnerNum}
                    data={passData}
                    textColors={['white','black']}
                    backgroundColors={['black','red']}
                    radiusLineWidth={0}
                    fontSize={10}
                    textDistance={80}
                    onStopSpinning={()=>{
                        setRevealAnswer(isSpin);
                        setIsSpin(false);
                        setCountDown(3);
                        setIsSpinning(true);
                    }}
                />
                <Button disabled={true}>
                    {!isSpinning ? <Typography>Spinning...</Typography> : <Typography>Done!</Typography>}
                </Button>
                </Box>
                </>
            )}
        </>
    )
}