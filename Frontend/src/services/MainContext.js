import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MainContext  = createContext()

const MainContextProvider = (props) => {
    const localJWT = localStorage.getItem('token') || ''
    const navigate = useNavigate()
    
    const [jwt, setJwt] = useState(localJWT)
    
    useEffect(() => {
        if (jwt === '') {
            localStorage.removeItem('token')
            navigate('/')
        }
    }, [ , jwt])

    return(
        <MainContext.Provider value = {{ jwt, setJwt }}>
            {props.children}
        </MainContext.Provider>
    )
}

export {MainContextProvider, MainContext}