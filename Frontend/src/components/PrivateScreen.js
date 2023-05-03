import React, { useContext, useState, useEffect } from 'react'
import { MainContext } from '../MainContext'
import AuthService from '../services/authService'
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MdAccountCircle as Account } from 'react-icons/md'

const PrivateScreen = () => {
    const {jwt, setJwt} = useContext(MainContext)
    const [user, setUser] = useState(null)
    const {pathname} = useLocation()
    const history = useNavigate()

    const goToSetting = () => {
        history('/dash/settings')
    }

    useEffect(() => {
        try {
            return setUser(JSON.parse(atob(jwt.split('.')[1])))
        }
        catch(err) {
            AuthService.logout()
            setJwt('')
            return history('/')
        }
    }, [jwt, history, setJwt])

    return (
        <div class="flex flex-col h-screen">
            <header class="
                flex fixed items-center justify-end 
                pr-6 h-20 w-full bg-amber-700 drop-shadow-2xl
            ">
                {
                    pathname !== '/dash/settings' &&
                    <button onClick={goToSetting} class="text-5xl invert">
                        <Account/>
                    </button>
                }
            </header>

            <div class="flex justify-center items-center grow bg-cream-200 mt-20">
                <Outlet context={user}/>
            </div>
        </div>
    )
}

export default PrivateScreen

