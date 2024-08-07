import React, { lazy, Suspense } from 'react';
import LoadingScreen from '../loading_screen';

const Loadable = (Component) => (props) => (
    <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
    </Suspense>
)

// Main Entry
export const Welcome1 = Loadable(lazy(() => import('../page/welcome/Welcome')));
export const Login = Loadable(lazy(() => import('../page/login')));
export const Signup = Loadable(lazy(() => import('../page/signup')));
export const DataList = Loadable(lazy(() => import('../page/dashboard/newComponent/DataList')));
export const EditData = Loadable(lazy(() => import('../page/dashboard/newComponent/EditData')));
export const NewEntry = Loadable(lazy(() => import('../page/dashboard/newComponent/NewEntry')));
export const Testing = Loadable(lazy(() => import('../page/dashboard/newComponent/Testing')));
export const Testing2 = Loadable(lazy(() => import('../page/dashboard/newComponent/Testing2')));
export const Notification = Loadable(lazy(() => import('../page/dashboard/newComponent/Notification')));

// Dashboard Component
export const MainLayout = Loadable(lazy(() => import('../page/dashboard/layout')));
