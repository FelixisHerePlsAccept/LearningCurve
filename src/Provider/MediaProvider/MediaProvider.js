import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/system";
import { createContext } from "react";

const MediaContext = createContext();

export const MediaProvider = ({children}) => {
    const theme = useTheme();
    
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <MediaContext.Provider value={{isMobile}}>
            {children}
        </MediaContext.Provider>
    )
}

export default MediaContext;