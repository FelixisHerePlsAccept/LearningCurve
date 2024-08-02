import React, { useContext } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import {
Welcome1,
MainLayout,
Login,
DataList,
} from './element';
import AuthContext from '../AuthProvider/AuthGuard';

export const ROOT_DASHBOARD = '/customlinktree'

export default function Router() {

    const { currentUser } = useContext(AuthContext)

    const LimitEntrance = ({children}) => {
        return currentUser ? children : <Navigate to='/login' replace />
    }

    return useRoutes([
        {
            path:'',
            element:<Navigate to='/login' replace/>
        },
        {
            path: '/login',
            element: <Login />
        },
        {
            path:'*',
            element: <NotFound />
        },
        {
            path: 'welcome',
            element: <Welcome1 />
        },
        {
            path: 'mainpage',
            element: (
                <LimitEntrance>
                    <MainLayout />
                </LimitEntrance>
            ),
            children:[
                {element: <Navigate to='/mainpage/datalist' replace />, index:true},
                {path: 'datalist', element: <DataList />},
            ]
        }
    ])
}

function NotFound () {
    return <h2>Nuh uh</h2>
}

