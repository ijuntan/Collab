import React from 'react'
import { Routes, Route } from 'react-router-dom'

import LandingPage from './components/LandingPage'
import DashboardPage from './components/DashboardPage'

import { MainContextProvider } from './MainContext'
import AuthComponent from './services/authComponent'

const Navigation = () => {
    return (
        <MainContextProvider>
            <Routes>
                <Route path="/" element = {<LandingPage/>} />
                <Route path="/dash" element = { 
                    <AuthComponent>
                        <DashboardPage/>
                    </AuthComponent>
                } />
            </Routes>
        </MainContextProvider>
    )
}

export default Navigation