import React, { useEffect, useContext, createContext, useState } from 'react'
import { MainContext } from './MainContext'
import { useNavigate } from 'react-router-dom'
import userService from './userService'

export const UserContext  = createContext()

const AuthComponent = (props) => {
    const { jwt } = useContext(MainContext)
    const [user, setUser] = useState(jwt && JSON.parse(atob(jwt.split('.')[1])))
    const history = useNavigate()

    useEffect(() => {
        if(!jwt || jwt === '') {
            return history('/')
        }

        const fetchUser = async() => {
            const promise = await userService.getUserByName(user.username)
            setUser(promise.data)
        }

        fetchUser()
    }, [ ,jwt, history])

    return(
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    )
}

export default AuthComponent
