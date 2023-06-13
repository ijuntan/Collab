import React from 'react'
import { Routes, Route } from 'react-router-dom'

import LandingPage from './components/LandingPage'
import DashboardPage from './components/DashboardPage'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import PrivateScreen from './components/PrivateScreen'

import { MainContextProvider } from './MainContext'
import AuthComponent from './services/authComponent'
import Settings from './components/Settings'
import AddPost from './components/AddPost'
import PostScreen from './components/PostScreen'

const Navigation = () => {
    return (
        <MainContextProvider>
            <Routes>
                <Route path="/" element = {<LandingPage/>} />
                <Route path="forgot-password" element = {<ForgotPassword/>} />
                <Route path="reset-password/:resetToken" element = {<ResetPassword/>} />
                
                <Route path="dash" element = {
                    <AuthComponent>
                        <PrivateScreen/>
                    </AuthComponent>
                }>
                    <Route path="" element = {<DashboardPage/>} />
                    <Route path="settings" element = {<Settings/>} />
                    <Route path="addpost" element = {<AddPost/>} />
                    <Route path="post/:id" element = {<PostScreen/>} />
                </Route>
            </Routes>
        </MainContextProvider>
    )
}

export default Navigation