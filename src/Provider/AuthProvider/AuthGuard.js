import { createContext, useEffect, useMemo, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const AuthContext = createContext();

const INITIAL_STATE =  {
    currentUser: localStorage.getItem('YaBoi')? JSON.parse(localStorage.getItem('YaBoi')) : null
}

export const AuthProvider = ({children}) => {

    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    useEffect(() => {
        localStorage.setItem('YaBoi', JSON.stringify(state.currentUser))
    }, [state.currentUser])

    const MemoValue = useMemo (
        () => ({
            currentUser: state.currentUser,
        }),
        [state.currentUser]
    )

    return <AuthContext.Provider value={{...MemoValue, dispatch}}>{children}</AuthContext.Provider>
}

export default AuthContext