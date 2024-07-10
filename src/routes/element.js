import React from 'react';

// Loading Screen
export const LoadingScreen = React.lazy(() => import('../loading_screen/LoadingScreen'));

// Main Entry
export const Welcome1 = React.lazy(() => import('../page/welcome/Welcome'));

// Dashboard Component
export const MainLayout = React.lazy(() => import('../page/dashboard/layout'));
export const Dashboard = React.lazy(() => import('../page/dashboard/dashboardcomponent/Dashboard'));
export const Profile = React.lazy(() => import('../page/dashboard/dashboardcomponent/Profile'));
export const DrawingPort = React.lazy(() => import('../page/dashboard/dashboardcomponent/DrawingPort'));
export const Social = React.lazy(() => import('../page/dashboard/dashboardcomponent/Social'));
export const Randomizer = React.lazy(() => import('../page/dashboard/dashboardcomponent/Randomizer'));

// DB testing
export const DBTesting = React.lazy(() => import('../page/dashboard/dashboardcomponent/DBTesting'));
export const RandomizerDb = React.lazy(() => import ('../page/dashboard/dashboardcomponent/RandomizerDb'));
export const Testing = React.lazy(() => import('../page/dashboard/mock/Testing'));