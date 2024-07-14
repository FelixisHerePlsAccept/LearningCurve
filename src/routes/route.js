import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import {
Welcome1,
Profile,
DrawingPort,
Social,
MainLayout,
Dashboard,
// Randomizer,
LoadingScreen,
DBTesting,
RandomizerDb,
} from './element';

export const ROOT_DASHBOARD = '/customlinktree'

export default function Router() {

    const LoadingSuspense = ({children}) => (
        <Suspense fallback={<LoadingScreen />}>
            {children}
        </Suspense>
    );

    return (
        <Routes>
            {/* Welcome Page */}
            <Route path={ROOT_DASHBOARD} element={
                <LoadingSuspense>
                    <Welcome1 />
                </LoadingSuspense>
            } />

            {/* <Route path={`${ROOT_DASHBOARD}/loading`} element={
                <Suspense fallback={<div>Loading...</div>}>
                    <LoadingScreen />
                </Suspense>
            } /> */}

            {/* Dashboard Components */}
            <Route path={`${ROOT_DASHBOARD}/mainpage/`} element={
                <LoadingSuspense>
                    <MainLayout />
                </LoadingSuspense>
            }>
                {/* Outlet of Dashboardlayout */}
                <Route path='dashboard' element={
                    <LoadingSuspense>
                        <Dashboard />
                    </LoadingSuspense>
                } />
                <Route path="profile" element={
                    <LoadingSuspense>
                        <Profile />
                    </LoadingSuspense>
                } />
                <Route path="drawingport" element={
                    <LoadingSuspense>
                        <DrawingPort />
                    </LoadingSuspense>
                } />
                <Route path="social" element={
                    <LoadingSuspense>
                        <Social />
                    </LoadingSuspense>
                } />
                {/* <Route path="randomizer" element={
                    <LoadingSuspense>
                        <Randomizer />
                    </LoadingSuspense>
                } /> */}
                <Route path='dbtesting' element={
                    <LoadingSuspense>
                        <DBTesting />
                    </LoadingSuspense>
                } />
                <Route path={`randomwithdb`} element={
                    <LoadingSuspense>
                        <RandomizerDb/>
                    </LoadingSuspense>
                }/>
                <Route path='*' element={
                    <LoadingSuspense>
                        <NotFound />
                    </LoadingSuspense>
                } />
            </Route>
        </Routes>
    )
}

function NotFound () {
    return <h2>Nuh uh</h2>
}

