import React, { useContext } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import {
Welcome1,
MainLayout,
Login,
DataList,
Signup,
Testing,
Testing2,
Notification,
} from './element';
import AuthContext from '../Provider/AuthProvider/AuthGuard';

export const ROOT_DASHBOARD = '/customlinktree'

export default function Router() {

    const { currentUser } = useContext(AuthContext)

    const LimitEntrance = ({children}) => {
        if (currentUser) {
            return children
        } else {
            return <Navigate to='/login' replace />
        }
    }

    return useRoutes([
        {
            path:'',
            element:<Navigate to='/mainpage/datalist' replace/>
        },
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/signup',
            element: <Signup />
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
                {path: 'testing', element: <Testing />},
                {path: 'testing2', element: <Testing2 />},
                {path: 'notification', element: <Notification />},
            ]
        }
    ])
}

function NotFound () {
    return <h2>Nuh uh</h2>
}

