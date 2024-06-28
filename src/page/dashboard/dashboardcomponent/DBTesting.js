import { Container, Tab, Tabs } from "@mui/material";
import DataList from "./DataList";
import NewEntry from "./NewEntry";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function DBTesting() {

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Tabs value={value} onChange={handleChange}>
                <Tab label='New Entry Form' />
                <Tab label='Data List Table' />
            </Tabs>
            <Container maxWidth={'md'} sx={{p:'2rem'}}>
                {value === 0 && <NewEntry />}
                {value === 1 && <DataList />}
            </Container>
        </>
    );
}

