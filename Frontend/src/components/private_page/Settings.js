import React, { useEffect, useContext } from 'react'
import {useOutletContext} from 'react-router-dom'
import AuthService from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../../services/MainContext'

const Settings = () => {
    const {setJwt} = useContext(MainContext)
    const { user } = useOutletContext();
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
        <div className="flex justify-center items-center w-full h-full">
            <div className="flex relative flex-col justify-center items-center rounded-lg p-4 bg-white drop-shadow-2xl mb-40">
                <button onClick={handleExit} className="absolute right-2 top-1 font-bold">
                    x
                </button>
                <div>
                    {user.username}
                </div>
                <button className="w-full bg-amber-700 rounded-lg mt-4 py-2 px-10 text-white font-bold hover:bg-amber-800">
                    My Profile
                </button>
                <button className="w-full bg-amber-700 rounded-lg mt-4 py-2 px-10 text-white font-bold hover:bg-amber-800">
                    My Posts
                </button>
                <button className="w-full bg-amber-700 rounded-lg mt-4 py-2 px-10 text-white font-bold hover:bg-amber-800">
                    Connect Social Link
                </button>
                <button onClick={logout} className="w-full bg-amber-700 rounded-lg mt-4 py-2 px-10 text-white font-bold hover:bg-amber-800">
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Settings