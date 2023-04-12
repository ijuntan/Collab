import React, { useEffect, useContext } from 'react'
import { MainContext } from '../MainContext'
import { useNavigate } from 'react-router-dom'

const AuthComponent = (props) => {
    const { jwt } = useContext(MainContext)
    const history = useNavigate()

    useEffect(() => {
        if(!jwt || jwt === '') {
            return history('/')
        }
    }, [jwt, history])

    return(
        <>
            {props.children}
        </>
    )
}

export default AuthComponent
