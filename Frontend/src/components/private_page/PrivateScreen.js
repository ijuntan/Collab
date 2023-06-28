import React, { useContext, useState, useEffect, Fragment } from 'react'
import { MainContext } from '../../services/MainContext'
import { UserContext } from '../../services/authComponent'
import AuthService from '../../services/authService'
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MdAccountCircle as Account, MdExpandMore as Down } from 'react-icons/md'
import { Menu } from '@headlessui/react'
import Header from "./Header"

const filterCategory = [
    "None",
    "Website",
    "AI",
    "Electronics",
    "Science",
    "Business"
]

const PrivateScreen = () => {
    const user = useContext(UserContext);
    const [searchContent, setSearchContent] = useState("")

    return (
        <div className="flex flex-col">
            <Header searchContent={searchContent} setSearchContent={setSearchContent}/> 
            
            <div className="flex min-h-screen bg-cream-200 mt-20">
                <Outlet context={{user, searchContent}}/>
            </div>
        </div>
    )
}

export default PrivateScreen

