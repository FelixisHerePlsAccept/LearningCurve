import { Accordion, AccordionDetails, AccordionSummary, Breadcrumbs, Container, Grid, Tab, Tabs, Typography } from "@mui/material";
import DataList from "./DataList";
import NewEntry from "./NewEntry";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { PlusCircleIcon } from "@heroicons/react/outline";


export default function DBTesting() {

    const [expanded, setExpanded] = useState(false);

    const [crud, setCrud] = useState(false); //alternate between true and false to trigger useEffect

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    const handleCloseAccordian = () => {
        setExpanded(false)
    }

    return (
        <>
            <Helmet>
                <title>Data Management</title>
            </Helmet>
            <Breadcrumbs separator= " | ">
                <Typography variant='inherit'>
                    Dashboard
                </Typography>
                <Typography variant='inherit'>
                    DB CRUD
                </Typography>
            </Breadcrumbs>
            <Container maxWidth={'md'} sx={{pt:'1rem'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Accordion expanded={expanded === 'newEntry'} onChange={handleChange('newEntry')} sx={{width:'fit-Content'}}>
                            <AccordionSummary expandIcon={<div style={{width:'2rem', height:'2rem'}}><PlusCircleIcon /></div>}>
                                <Typography>
                                    New Entry Form
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <NewEntry setCrud={setCrud} onSubmitChange={handleCloseAccordian} />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={12}>
                        <DataList crud={crud} />
                    </Grid>
                </Grid>
            </Container>
        </>
    )

   
}

function DB () {
    
    const [value, setValue] = useState(0); 

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Helmet>
                <title>DB Management</title>
            </Helmet>
            <Breadcrumbs separator= " | ">
                <Typography variant='inherit'>
                    Dashboard
                </Typography>
                <Typography variant='inherit'>
                    DB CRUD
                </Typography>
            </Breadcrumbs>
            <Tabs value={value} onChange={handleChange} sx={{pt:'.5rem'}}>
                <Tab label='New Entry Form' />
                <Tab label='Data List Table' />
            </Tabs>
            <Container maxWidth={'md'} sx={{pt:'.5rem'}}>
                {value === 0 && <NewEntry />}
                {value === 1 && <DataList />}
            </Container>
        </>
    );
}