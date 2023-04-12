import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MainContext } from '../MainContext'
import AuthService from '../services/authService'

const DashboardPage = () => {
    const {jwt, setJwt} = useContext(MainContext)
    const [parsed, setParsed] = useState('')
    const history = useNavigate()

    useEffect(() => {
        try {
            return setParsed(JSON.parse(atob(jwt.split('.')[1])))
        }
        catch(err) {
            AuthService.logout()
            setJwt('')
            return history('/')
        }
    }, [jwt, history, setJwt])

    return (
        <div>
            
            <p>Username:{JSON.stringify(parsed.username, null, 2)}</p>
            <p>Password:{JSON.stringify(parsed.password, null, 2)}</p>
        </div>
        
    )
}

export default DashboardPage