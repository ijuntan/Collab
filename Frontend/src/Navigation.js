import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Public Page
import LandingPage from './components/public_page/LandingPage'
import ForgotPassword from './components/public_page/ForgotPassword'
import ResetPassword from './components/public_page/ResetPassword'

import { MainContextProvider } from './services/MainContext'
import AuthComponent from './services/authComponent'

// Private Page
import PrivateScreen from './components/private_page/PrivateScreen'
import Settings from './components/private_page/Settings'
import AddPost from './components/private_page/AddPost/AddPostNavigation'
import PostScreen from './components/private_page/PostScreen'
import Project from './components/private_page/Project'
import ProjectPage from './components/private_page/ProjectPage'
import Post from './components/private_page/Post'
import TextEditor from './components/private_page/TextEditor'

import DashboardContainer from './components/private_page/Dashboard/DashboardContainer'
import VerifyEmail from './components/public_page/VerifyEmail'
import Error404 from './components/public_page/Error404'

const Navigation = () => {
    return (
        <MainContextProvider>
            <Routes>
                <Route path="/" exact element = {<LandingPage/>} />
                <Route path="forgot-password" exact element = {<ForgotPassword/>} />
                <Route path="reset-password/:resetToken" element = {<ResetPassword/>} />
                <Route path="confirm/:emailToken" element = {<VerifyEmail/>} />
                <Route path="error" element = {<Error404/>} />
                <Route path="dash" element = {
                    <AuthComponent>
                        <PrivateScreen/>
                    </AuthComponent>
                }>
                    <Route path="" element = {<DashboardContainer/>} />
                    <Route path="settings" element = {<Settings/>} />
                    <Route path="addpost" element = {<AddPost/>} />
                    <Route path="project" element = {<Project/>} />
                    <Route path="post" element = {<Post/>} />
                    <Route path="post/:id" element = {<PostScreen/>} />
                    <Route path="project/:id" element = {<ProjectPage/>} />
                    <Route path="text/:id" element = {<TextEditor/>} />
                </Route>
            </Routes>
        </MainContextProvider>
    )
}

export default Navigation