import { createContext, useEffect, useMemo, useReducer } from "react";
import DataReducer from "./DataReducer";
import { auth, db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const DataContext = createContext();

const INITIAL_STATE = {
    dataRetrieved: null
}

export const DataProvider = ({ children }) => {

    const [state, dispatch] = useReducer(DataReducer, INITIAL_STATE)

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('Triggered with auth')
                const unsubscribeRead = onSnapshot(collection(db, "MYBOOKMARKS"), (querySnapshot) => {
                    const documentRead = querySnapshot.docs.map((doc) => ({
                        docId: doc.id,
                        ...doc.data(),
                    }))
                    dispatch({ type: 'RETRIEVE_DATA', payload: documentRead })
                    console.log('Triggered here Read')
                }, (error) => {
                    if (error.code === 'resource-exhausted') {
                        dispatch({type: 'QUOTA_MAX', payload: true})
                        alert('Sorry, Free Quota is exhausted. Retry tomorrow at 3pm.')
                    } else {
                        console.error("Error fetching documents:", error);
                    }
                })
                const unsubcribeCreate = onSnapshot(collection(db, "RequestCreate"), (querySnapshot) => {
                    const documentCreate = querySnapshot.docs.map((doc) => ({
                        docId: doc.id,
                        ...doc.data(),
                    }))
                    dispatch({ type: 'Notification-Add', payload: documentCreate })
                    console.log('Triggered here')
                }, (error) => {
                    if (error.code === 'resource-exhausted') {
                        dispatch({type: 'QUOTA_MAX', payload: true})
                        alert('Sorry, Free Quota is exhausted. Retry tomorrow at 3pm.')
                    } else {
                        console.error("Error fetching documents:", error);
                    }
                })
                const unsubscribeUpdate = onSnapshot(collection(db, "RequestedChange"), (querySnapshot) => {
                    const documentUpdate = querySnapshot.docs.map((doc) => ({
                        docId: doc.id,
                        ...doc.data(),
                    }))
                    dispatch({ type: 'Notification-Update', payload: documentUpdate })
                    console.log('Triggered here')
                }, (error) => {
                    if (error.code === 'resource-exhausted') {
                        dispatch({type: 'QUOTA_MAX', payload: true})
                        alert('Sorry, Free Quota is exhausted. Retry tomorrow at 3pm.')
                    } else {
                        console.error("Error fetching documents:", error);
                    }
                })
                const unsubscribeRemove = onSnapshot(collection(db, "RequestedDelete"), (querySnapshot) => {
                    const documentRemove = querySnapshot.docs.map((doc) => ({
                        docId: doc.id,
                        ...doc.data(),
                    }))
                    dispatch({ type: 'Notification-Remove', payload: documentRemove })
                    console.log('Triggered here')
                }, (error) => {
                    if (error.code === 'resource-exhausted') {
                        dispatch({type: 'QUOTA_MAX', payload: true})
                        alert('Sorry, Free Quota is exhausted. Retry tomorrow at 3pm.')
                    } else {
                        console.error("Error fetching documents:", error);
                    }
                })

                return () => {
                    unsubscribeRead()
                    unsubcribeCreate()
                    unsubscribeUpdate()
                    unsubscribeRemove()
                }
            } else {
                console.log('Triggered no auth')
                dispatch({ type: 'RETRIEVE_DATA', payload: null })
            }
            
        })
        
        return () => unsubscribeAuth()
    },[dispatch])

    const MemoValue = useMemo (
        () => ({
            dataRetrieved: state.dataRetrieved,
            notifyAdd: state.notificationAdd,
            notifyRemove: state.notificationRemove,
            notifyUpdate: state.notificationUpdate,
            maxQuota: state.quotaMax
        }),
        [state.dataRetrieved, state.quotaMax, state.notificationAdd, state.notificationRemove, state.notificationUpdate]
    )

    return (
        <DataContext.Provider value={{ ...MemoValue, dispatch}}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext