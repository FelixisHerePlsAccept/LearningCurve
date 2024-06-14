import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import {
Welcome1,
Profile,
DrawingPort,
Social,
MainLayout,
Dashboard,
Randomizer,
} from './element';

export const ROOT_DASHBOARD = '/customlinktree'

export default function Router() {
    return (
        <Routes>
            {/* Welcome Page */}
            <Route path={ROOT_DASHBOARD} element={
                <Suspense fallback={<div>Loading...</div>}>
                    <Welcome1 />
                </Suspense>
            } />

            {/* Dashboard Components */}
            <Route path={`${ROOT_DASHBOARD}/mainpage/*`} element={
                <Suspense fallback={<div>Loading...</div>}>
                    <MainLayout />
                </Suspense>
            }>
                {/* Outlet of Dashboardlayout */}
                <Route path='dashboard' element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <Dashboard />
                    </Suspense>
                } />
                <Route path="profile" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <Profile />
                    </Suspense>
                } />
                <Route path="drawingport" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <DrawingPort />
                    </Suspense>
                } />
                <Route path="social" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <Social />
                    </Suspense>
                } />
                <Route path="randomizer" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <Randomizer />
                    </Suspense>
                } />
                <Route path='*' element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <NotFound />
                    </Suspense>
                } />
            </Route>
        </Routes>
    )
}

function NotFound () {
    return <h2>Nuh uh</h2>
}
