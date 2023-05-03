import React, { useEffect, useContext } from 'react'
import {useOutletContext} from 'react-router-dom'
import AuthService from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../MainContext'

const Settings = () => {
    const {jwt, setJwt} = useContext(MainContext)

    const user = useOutletContext();
    const history = useNavigate();
    const handleExit = () => {
        history(-1)
    }

    const logout = () => {
        AuthService.logout()
        setJwt('')
        return history('/')
    }

    return (
        <div class="flex justify-center items-center w-full h-full">
            <div class="flex relative flex-col justify-center items-center rounded-lg p-4 bg-white">
                <button onClick={handleExit} class="absolute right-2 top-1 font-bold">
                    x
                </button>
                <button onClick={logout} class="bg-amber-700 rounded-lg mt-4 py-2 px-10 text-white font-bold">
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Settings