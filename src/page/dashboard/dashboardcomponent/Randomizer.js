import PropType from 'prop-types';
import { Box, Breadcrumbs, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Wheel } from 'react-custom-roulette'
import { Helmet } from 'react-helmet-async';
import { AnimeChar, AnimePic, AnimeTitle, Artist, ArtistUrl, BodyShot, Model, ModelUrl, GameChar, GamePic, GameTitle, Pose, PoseUrl, VtuberAffliate, VtuberName, VtuberPic } from '../mock/artist';
import { Link } from 'react-router-dom';
import { ROOT_DASHBOARD } from '../../../routes/route';
import LoadingScreen from '../../../loading_screen/LoadingScreen';
import Switch from '@mui/material/Switch';

const reference = [
    {
        id:1,
        option:'Artist'
    },
    {
        id:2,
        option:'Model'
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
        option:'Anime Character'
    },
    {
        id:7,
        option: 'Vtuber'
    },
];

//=========== ARTIST =============
const artistName = Artist;
const artisturl = ArtistUrl;
const ArtistData = Array.from({length: Artist.length },(_,index) => ({
    id: index+1,
    option: artistName[index],
    url: artisturl[index],
}));

//=========== COSPLAYER =============
const cosplayer = Model;
const cosplaypic = ModelUrl;
const CosplayerData = Array.from({ length: Model.length },(_,index) => ({
    id: index+1,
    option: cosplayer[index],
    url: cosplaypic[index],
}));

//======== POSE REFERENCE ============
const pose = Pose;
const poseurl = PoseUrl;
const PoseData = Array.from({ length: Pose.length }, (_,index) => ({
    id: index+1,
    option: pose[index],
    url: poseurl[index],
}));

//======== GAME CHARACTER ==========
const gamecharname = GameChar;
const gamepicurl = GamePic;
const gametitle = GameTitle;
const GameData = Array.from({ length: GameChar.length }, (_,index) => ({
    id: index+1,
    option: gamecharname[index],
    url: gamepicurl[index],
    title: gametitle[index],
}))

//========== ANIME ==================
const anime = AnimeChar;
const pic = AnimePic;
const title = AnimeTitle;
const AnimeData = Array.from({ length: AnimeChar.length }, (_,index) => ({
    id: index + 1,
    option: anime[index],
    url: pic[index],
    title: title[index],
}))

//========= VTUBER ==================
const vtubername = VtuberName;
const vtuberpic = VtuberPic;
const affliate = VtuberAffliate;
const VtuberData = Array.from({ length: VtuberName.length }, (_,index) => ({
    id: index+1,
    option: vtubername[index],
    url: vtuberpic[index],
    title: affliate[index],
}))



//======== BodyShot ================
const body = BodyShot;
const BodyData = Array.from({ length: BodyShot.length }, (_,index) => ({
    id: index+1,
    option: body[index],
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

    // dataType as follow
    // if 'one' => specific body type
    // if 'two' => the others
    // if 'three' => game and anime
    const [ dataType, setDataType ] = useState('');

    const [ imgurl, setImgUrl ] = useState('');

    const [ origin, setOrigin ] = useState('');

    const [ preventReset, setPreventReset ] = useState(false);

    const [ preset, setPreset ] = useState(false); 

    const [ rigged, setRigged ] = useState(-1); 

    const [ isLoading, setIsLoading ] = useState(true); 

    const [ redoSpin, setRedoSpin ] = useState(0); 

    const [ listWinner, setListWinner ] = useState([]); 
    
    const [ redoPin, setRedoPin ] = useState(false);

    const [ redoPinNum, setRedoPinNum ] = useState(null);

    const [ checked, setChecked ] = useState(false);

    const [ holdDiscard, setHoldDiscard ] = useState(false);

    console.log(
        '\n','isSpin',isSpin, '\n',
        'winnerNum', winnerNum,'\n',
        'winnerPrint', winnerPrint,'\n',
        'winnerPrint2', winnerPrint2,'\n',
        'revealButton', revealButton,'\n',
        'revealAnswer', revealAnswer,'\n',
        'passedData', passedData,'\n',
        'countdown', countdown,'\n',
        'allowredirect', allowRedirect,'\n',
        'url', url,'\n',
        'datatype', dataType,'\n',
        'imgurl', imgurl,'\n',
        'origin', origin,'\n',
        'preventReset',preventReset,'\n',
        'preset', preset,'\n',
        'rigged', rigged,'\n',
        'isLoading', isLoading,'\n',
        'redoSpin', redoSpin,'\n',
        'listWinner', listWinner,'\n',
        'redoPin',redoPin,'\n',
        'redoPinNum', redoPinNum, '\n',
        'checked', checked, '\n',
        'holdDiscard', holdDiscard,'\n'
    )

    useEffect (() => {
        const reftype = winnerPrint;
        if (revealButton) {
            switch(reftype) {
                default:
                    return;
                case 'Artist':
                    setDataType('two');
                    if(redoSpin !== 0){
                        console.log('winnerPrint2', winnerPrint2)
                        const newArtistData = ArtistData.filter((name)=>!listWinner.includes(name.option));
                        setPassedData(newArtistData);
                        console.log('NewArtistData', newArtistData);
                    } else {
                        setPassedData(ArtistData);
                    }
                    break;
                case 'Model':
                    setDataType('two');
                    if(redoSpin !== 0){
                        const newCosplayerData = CosplayerData.filter((name)=>!listWinner.includes(name.option));
                        setPassedData(newCosplayerData);
                    } else {
                        setPassedData(CosplayerData);
                    }
                    break;
                case 'Pose Reference':
                    setDataType('two');
                    if(redoSpin !== 0){
                        const newPoseData = PoseData.filter((name)=>!listWinner.includes(name.option));
                        setPassedData(newPoseData);
                    } else {
                        setPassedData(PoseData);
                    }
                    break;
                case 'Game Character':
                    setDataType('three');
                    if(redoSpin !== 0){
                        const newGameData = GameData.filter((name)=>!listWinner.includes(name.option));
                        setPassedData(newGameData);
                    } else {
                        setPassedData(GameData);
                    }
                    break;
                case 'Specific Body Parts':
                    setDataType('one');
                    if(redoSpin !== 0){
                        const newBodyData = BodyData.filter((name)=>!listWinner.includes(name.option));
                        setPassedData(newBodyData);
                    } else{
                        setPassedData(BodyData);
                    }
                    break;
                case 'Anime Character':
                    setDataType('three');
                    if(redoSpin !== 0){
                        const newAnimeData = AnimeData.filter((name)=>!listWinner.includes(name.option));
                        setPassedData(newAnimeData);
                    } else{
                        setPassedData(AnimeData);
                    }
                    break;
                case 'Vtuber':
                    setDataType('three');
                    if(redoSpin !== 0){
                        const newVtuberData = VtuberData.filter((name)=>!listWinner.includes(name.option));
                        setPassedData(newVtuberData);
                    } else {
                        setPassedData(VtuberData);
                    }
                    break;
            }
        }
    }, [ winnerPrint, revealButton, redoSpin ] )

    useEffect(() => { 
        let countdownInterval = null;
        if(revealAnswer) {
            if(dataType === 'two'){
                setWinnerPrint2(winnerPrint2);
                const data = passedData.find((name) => name.option === winnerPrint2);
                setURL(data.url);
                if (countdown > 0) {
                    countdownInterval = setInterval(() => {
                        setCountdown(countdown-1);
                    }, 1000)
                }
                else if (countdown === 0 && allowRedirect) {
                    if(winnerPrint2 === 'Pose Reference')
                        {
                            window.open(data.url,'_blank');    
                        }
                        else {
                            window.open(`https://x.com/${winnerPrint2}/media`,'_blank')
                        }
                }
                return () => clearInterval(countdownInterval);
            }
            else if (dataType === 'three'){
                setCountdown(0);
                setAllowRedirect(false);
                setWinnerPrint2(winnerPrint2);
                const data = passedData.find((name) => name.option === winnerPrint2);
                setImgUrl(data.url);
                setOrigin(data.title);
            }
            else {
                // dataType === 'one'
                setCountdown(0);
                setAllowRedirect(false);
                setWinnerPrint2(winnerPrint2);
            }
            document.body.scrollTop = document.body.scrollHeight;
            document.documentElement.scrollTop = document.documentElement.scrollHeight;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown])

    const handleClick = () => {
        setIsSpin(true);
        setRedoPin(true);
        if(preset){
            setWinnerNum(rigged);
            setWinnerPrint(reference[rigged].option);
            setRedoPinNum(rigged);
        }
        else 
        {
            const Winner = Math.floor(Math.random() * reference.length);
            // const Winner = 3;
            setWinnerNum(Winner);
            setWinnerPrint(reference[Winner].option);
            setRedoPinNum(Winner);
        };
    };

    const handleRigged = (event) => {
        setRedoPin(true);
        setRedoPinNum(event.target.value);
        setRigged(event.target.value);
        setWinnerNum(event.target.value);
        setWinnerPrint(reference[event.target.value].option);
        setRevealButton(true);
    };

    const handleSwitch = (event) => {
        setChecked(event.target.checked);
        setHoldDiscard(!event.target.checked);
    };

    const redosecondwheel = () => {
        setChecked(prev=>prev); //retain state
        setRedoSpin(prevRedoSpin => prevRedoSpin + 1);
        setIsSpin(false);
        setImgUrl('');
        setURL('');
        setAllowRedirect(true);
        setRevealAnswer(false);
        if(checked) {
            setListWinner(prevListWinner => [...prevListWinner])
        } else {
            if (holdDiscard || winnerPrint2 === ''){
                setListWinner(prevListWinner => [...prevListWinner])
            }
            else {
                setListWinner(prevListWinner => [...prevListWinner, winnerPrint2]);
            }
        }
    };

    const handleReturnData = (index) => {
        const newList = listWinner.filter((_, i) => i !== index);
        setListWinner(newList);
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
        setDataType('');
        setImgUrl('');
        setOrigin('');
        setPreventReset(false);
        setPreset(false);
        setRigged(-1);
        setRedoSpin(0);
        setIsLoading(true);
        setListWinner([]);
        setRedoPin(false);
        setRedoPinNum(0);
        setChecked(false);
    };

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
            <Grid container xs={12}>
                <Grid item xs={12} align='center'>
                    <Typography variant='h3'>
                        Drawing Reference {<br/>} Randomizer
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center" sx={{p:'1rem 0 1rem 0'}}>
                    { !preset && !revealButton ? 
                    (
                        <Button variant='contained' onClick={()=>{setPreset(true);setRigged(null)}} disabled={isSpin ? true : false}>
                            Preset winnner?
                        </Button>
                    )
                    :
                    (
                        null
                    )}
                    { preset && !revealButton && 
                    <>
                    <FormControl sx={{width:'50%'}}>
                        <Stack direction={'row'} >
                            <InputLabel>What You WANT To Draw?</InputLabel>
                            <Select value={rigged} onChange={handleRigged} sx={{width:'70%'}}>
                                <MenuItem value={null} disabled />
                                <MenuItem value={0}>Artist</MenuItem>
                                <MenuItem value={1}>Model</MenuItem>
                                <MenuItem value={2}>Pose Reference</MenuItem>
                                <MenuItem value={3}>Game Character</MenuItem>
                                <MenuItem value={4}>Specific Body Parts</MenuItem>
                                <MenuItem value={5}>Anime Character</MenuItem>
                                <MenuItem value={6}>Vtuber</MenuItem>
                            </Select>
                            <Box sx={{pl:'1rem'}}>
                                <Button variant='contained' disabled={isSpin ? true : false} onClick={()=>handlereset()} sx={{height:"60px", bgcolor:'red'}}>Cancel</Button>
                            </Box>
                        </Stack>
                    </FormControl>
                    </>
                    }
                </Grid>
            </Grid>
            <Grid container sx={{border:'1px solid black'}}>
                { revealAnswer ?
                
                (
                <>
                {redoSpin > 0 && 
                (
                <Grid item xs={12} align='right' sx={{pr:'1rem'}}>
                    <Typography variant='h6'>
                        Redo Spin Total Amount: <strong>{redoSpin}</strong>
                    </Typography>
                </Grid>
                )}
                <Grid item xs={12} md={12} sx={{p:'1rem'}}>
                    <Box sx={{minHeight:'30vh', width:'100%',mb:'5rem', textAlign:'center'}}>
                        { dataType === 'two' ?
                        (
                        <>
                            <Typography variant='h5'>
                                The drawing reference type is <strong>{winnerPrint}</strong>
                                <br/>
                                { winnerPrint === 'Pose Reference' ?
                                (
                                    <Stack direction={'row'} justifyContent={'center'} >
                                        <Typography variant='h5'>
                                            The {winnerPrint} to follow is &nbsp;
                                        </Typography>
                                        <a href={url} target='_blank' rel='noopener noreferrer' style={{textDecoration:'none'}}>
                                            {winnerPrint2}
                                        </a>
                                    </Stack>
                                ) 
                                :
                                (
                                    <>
                                        <Stack direction={'row'} justifyContent={'center'} sx={{pb:'2rem'}}>
                                            <Typography variant='h5'>
                                                {`The ${winnerPrint} to follow is `} &nbsp;
                                            </Typography>
                                            <a href={`https://x.com/${winnerPrint2}/media`} target='_blank' rel='noopener noreferrer' style={{textDecoration:'none'}}>
                                                @{winnerPrint2}
                                            </a> 
                                        </Stack>
                                        {isLoading && <LoadingScreen />}
                                        <img 
                                            src={url}
                                            alt={winnerPrint2}
                                            style={{
                                                width:'20rem',
                                                height:'20rem', 
                                                borderRadius:'50%', 
                                                border:'10px dotted',
                                                borderColor:'red pink magenta rgb(255,229,180)'
                                            }}
                                            onLoad={() => setIsLoading(false)}
                                        />
                                    </>
                                )}
                            </Typography>
                        </>
                        ):
                        dataType === 'one' ? (
                            <Typography variant='h5'>
                                {`The drawing reference type = ${winnerPrint}`}
                                <br/>
                                <Stack direction={'row'} justifyContent={'center'}>
                                    <Typography variant='h5'>
                                        You will be drawing <strong>{winnerPrint2}</strong>
                                    </Typography>
                                </Stack>
                            </Typography>
                        )
                        :
                        dataType === 'three' ? 
                        (
                            <Grid container>
                                <Grid item xs={12} align="center">
                                    <Typography>
                                       You are going to use <strong>{winnerPrint}</strong> as reference
                                    </Typography>
                                    <Typography variant='h5' sx={{p:'1rem 0 2rem 0'}}>
                                        The character you will be drawing is ...
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} align="center" sx={{width:'50vw'}}>
                                    {isLoading && <LoadingScreen />}
                                        <img 
                                        src={imgurl} 
                                        alt={winnerPrint2} 
                                        style={{ 
                                            borderRadius:'1rem',
                                            height:'30rem',
                                            border:'10px dotted',
                                            borderColor:'red pink magenta rgb(255,229,180)'
                                        }} 
                                        onLoad={() => setIsLoading(false)}
                                    />
                                </Grid>
                                <Grid item xs={12} align='center' sx={{pt:'1rem'}}>
                                    <Typography variant='h4'>
                                        <strong>{winnerPrint2}</strong> from <strong>{origin}</strong>
                                    </Typography>
                                </Grid>
                            </Grid>
                        )
                        :
                        (
                            null
                        )
                        }
                        {countdown !== 0 ? 
                        <>
                            <Stack direction='column' alignItems={'center'} sx={{pt:'1rem'}}>
                                {allowRedirect ? <Typography>Redirecting in <strong>{countdown}</strong></Typography> : null}
                                {countdown !== 0 && <Button sx={{width:'fit-content'}} variant='contained' onClick={()=>{setAllowRedirect(false);setCountdown(0)}}>Stop Redirect!</Button>}
                            </Stack>
                        </> 
                        :
                        <Stack direction='column' sx={{alignItems:'center', pt:'1rem'}}> 
                            <Typography variant='h5' sx={{textAlign:'center', p:'1rem 0 1rem 0'}}>
                                Happy Drawing👋
                            </Typography>
                            <Stack direction={'row'} spacing={3}>
                                <Button variant='contained' sx={{bgcolor:'red'}} onClick={handlereset}>
                                    Reset Wheel!
                                </Button>
                                <Button variant='contained' onClick={()=>redosecondwheel()}>
                                    Redo Spin  !
                                </Button>
                            </Stack>
                            <Divider />
                            <Box>
                                <Switch
                                    checked={checked}
                                    onChange={handleSwitch}
                                />
                            </Box>
                            <Typography variant='caption' sx={{color:checked ? 'green':'red', pb:'1rem'}}>
                                {checked ? 'REDO SPIN WILL NOT discard the winner from the wheel' : 'REDO SPIN WILL discard the winner from the wheel'}
                            </Typography>
                            { listWinner.length > 0 ? (
                                <Box sx={{p:'1rem', border:'1px solid grey', borderRadius:'1rem'}}>
                                    <Typography variant='h6' sx={{pb:'1rem', textDecoration:'underline'}}>
                                        Winners List:
                                    </Typography>
                                    <Typography sx={{textAlign:'left', pb:'1rem'}}>
                                        1. {winnerPrint2}
                                    </Typography>
                                    {listWinner.map((winner,index) => {
                                        return (
                                            <Grid container key={index}>
                                                <Grid item xs={12} md={10}>
                                                    <Typography sx={{textAlign:'left'}}>
                                                        {index+2}. <a href={`https://x.com/${winner}/media`} alt={winner} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>{winner}</a>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <Button onClick={()=>handleReturnData(index)} sx={{position:'relative',bottom:'8px'}}>
                                                        +
                                                    </Button>
                                                </Grid>
                                                
                                            </Grid>
                                        )
                                    })}
                                    <Button variant='contained' onClick={()=>{setListWinner([]);setWinnerPrint2('')}} sx={{bgcolor:'yellow', color:'black'}}>
                                        Bring Back Data
                                    </Button>
                                </Box>
                            )
                            :
                            (
                                null
                            ) }
                        </Stack>
                        }
                        {/* {countdown === 0 && <Stack sx={{alignItems:'center', pt:'1rem'}}><Button variant='contained' sx={{bgcolor:'reset',opacity:'.5'}} onClick={handlereset}>Reset Wheel!</Button></Stack> } */}
                    </Box>
                </Grid>
                </>
                )
                :
                (
                    <>
                    
                    <Grid item xs={12} md={revealButton ? 6 : 12} align="center">
                        <Wheel
                            startingOptionIndex={redoPin ? redoPinNum : null}
                            spinDuration={.25}
                            disableInitialAnimation={true}
                            backgroundColors={['red','#f6412d','#ff5607','#ff9800','#ffc100','#ffec19']}
                            mustStartSpinning={isSpin}
                            prizeNumber={!preset ? winnerNum : rigged }
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
                        <Box sx={{p:'2.5rem'}}>
                        <Button 
                            variant='contained' 
                            sx={{bgcolor:revealButton ? 'red' : 'none'}}
                            onClick={() => revealButton ? handlereset() : handleClick()}
                            disabled={isSpin || preventReset || rigged === null ? true : false}
                        >
                            {revealButton ? 'Reset the Wheel' : 'What to Draw?'}
                        </Button>
                        </Box>
                    </Grid>
                    {/* Second Wheel render here */}
                    {revealButton ? (
                        <Grid item xs={12} md={6} align="center">
                            <SecondWheel 
                                handlereset={handlereset}
                                passData={passedData}
                                setWinnerPrint2={setWinnerPrint2}
                                setRevealAnswer={setRevealAnswer}
                                setCountDown={setCountdown}
                                setPreventReset={setPreventReset}
                            />
                        </Grid>
                    )
                    :
                    (
                        null
                    )}
                    </>
                )
                }
                
            </Grid>
        </>
    )
}

// Second Wheel function
// ===================================================================================== //

SecondWheel.propTypes = {
    handlereset: PropType.func,
    passData: PropType.array,
    setWinnerPrint2: PropType.func,
    setRevealAnswer: PropType.func,
    setCountDown: PropType.func,
    setPreventReset: PropType.func,
}

function SecondWheel({ handlereset, passData, setWinnerPrint2, setRevealAnswer, setCountDown, setPreventReset }) {


    const [ revealWheel, setRevealWheel ] = useState(false);

    const [ isSpin, setIsSpin ] = useState(false);

    const [ isSpinning, setIsSpinning ] = useState(false);

    const [ winnerNum, setWinnerNum ] = useState(0);

    const handleReveal = () => {
        setPreventReset(true);
        setTimeout(()=>{
            setIsSpin(true);
        }, 500)
        setRevealWheel(true);
        if (passData.length === 0) {
            return;
        }
        else {
            const Winner = Math.floor(Math.random() * passData.length);
            setWinnerNum(Winner);
            const newWinnerPrint = passData[Winner].option;
            setWinnerPrint2(newWinnerPrint);
        }
    }

    return (
        <>
            {!revealWheel ?
            (
                <Box
                    sx={{
                        display:'flex',
                        justifyContent:'center',
                        width:'100%',
                        height:'100%',
                        alignItems:'center'
                    }}
                >
                    <Button variant='contained' 
                        sx={{
                            bgcolor:'lightgreen',
                            borderRadius:'50%', 
                            height:'7rem', 
                            width:'7rem'
                        }} 
                        onClick={handleReveal}
                    >
                        Reveal the second circle
                    </Button>
                </Box>
            )
            :
            (
                <>
                <Box sx={{alignItems:'center', height:'100%'}}>
                {passData.length === 0 ?
                <Box
                    sx={{
                        display:'flex',
                        width:'100%',
                        height:'100%',
                        justifyContent:'center',
                        alignItems:'center'
                    }}
                >
                    <Stack direction={'column'} spacing={5}>
                        <Typography variant='h5' fontFamily={'cursive'}>
                            There are no more data available
                        </Typography>
                        <Box>
                            <Button variant='contained' sx={{width:'fit-content', bgcolor:'red'}} onClick={()=>handlereset()}>
                                Reset Wheel
                            </Button>
                        </Box>
                    </Stack>
                </Box>
                :
                (
                    <>
                        <Wheel
                            disableInitialAnimation={true}
                            spinDuration={.25}
                            mustStartSpinning={isSpin}
                            prizeNumber={winnerNum}
                            data={passData}
                            textColors={['white']}
                            backgroundColors={['red','blue','orange']}
                            radiusLineWidth={2}
                            outerBorderWidth={2}
                            fontSize={10}
                            textDistance={80}
                            onStopSpinning={()=>{
                                setRevealAnswer(isSpin);
                                setIsSpin(false);
                                setCountDown(3);
                                setIsSpinning(true);
                            }}
                        />
                        {/* 
                            Switch here
                            If Switch is true, redo without data removal (listWinner === 0)
                            If switch is false, redo with removal (listWinner > 0)
                        */}
                        <Button disabled={true}>
                            {!isSpinning ? <Typography>Spinning...</Typography> : <Typography>Done!</Typography>}
                        </Button>
                    </>
                )}
                </Box>
                </>
            )}
        </>
    )
}