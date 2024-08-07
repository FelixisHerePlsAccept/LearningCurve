import { createContext, useEffect, useMemo, useReducer } from "react";
import ThemeReducer from "./ThemeReducer";

const ThemeContext = createContext();

const INIITIAL_STATE = {
    currentTheme: localStorage.getItem('currentTheme') ? localStorage.getItem('currentTheme') : 'light' 
}

export const CustomThemeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ThemeReducer, INIITIAL_STATE);

    useEffect(() => {
        localStorage.setItem('currentTheme', state.currentTheme)
    }, [state.currentTheme])

    const MemoValue = useMemo(
        () => ({
            currentTheme: state.currentTheme,
        }),
        [state.currentTheme]
    )

    return (
        <ThemeContext.Provider value={{ ...MemoValue, dispatch }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext