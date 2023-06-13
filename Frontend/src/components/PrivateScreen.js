import React, { useContext, useState, useEffect, Fragment } from 'react'
import { MainContext } from '../MainContext'
import AuthService from '../services/authService'
import { Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MdAccountCircle as Account, MdExpandMore as Down } from 'react-icons/md'
import { Menu } from '@headlessui/react'

const filterCategory = [
    "None",
    "Website",
    "AI",
    "Electronics",
    "Science",
    "Business"
]

const PrivateScreen = () => {
    const {jwt, setJwt} = useContext(MainContext)
    const [user, setUser] = useState({
        _id: "",
        username:""
    })
    const [filter, setFilter] = useState("None")
    const {pathname} = useLocation()
    const [searchContent, setSearchContent] = useState("")
    const history = useNavigate()

    const goToSetting = () => {
        history('settings')
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
    }, [ , jwt, history, setJwt])

    return (
        <div className="flex flex-col h-screen">    
            <header className="
                flex fixed items-center z-10
                pr-6 h-20 w-full bg-amber-700 drop-shadow-2xl
            ">
                <div className="flex justify-center gap-4 grow">
                    {
                        (pathname === '/dash' || pathname === '/dash/') &&
                        <>
                            <input
                            className="
                                bg-transparent border border-white rounded-lg outline-none
                                text-white font-bold p-2 placeholder-white w-96
                            "
                            value={searchContent}
                            placeholder="Search..."
                            onChange = {e => setSearchContent(e.target.value)}
                            />
                            
                            <Menu>
                                <Menu.Button className="inline-flex justify-center items-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30">
                                    {
                                        filter === "None"
                                        ?
                                            <>
                                                Filter
                                            </>
                                        :
                                            <>
                                            {filter}
                                            </>
                                    }
                                    <Down className="ml-2 -mr-1 h-5 w-5"/>
                                </Menu.Button>
                                <Menu.Items className="absolute flex flex-col ml-96 mt-12 bg-white rounded-lg p-2">
                                    {
                                        filterCategory.map((item, index) => (
                                            <Menu.Item key={index}>
                                                <button className="hover:bg-slate-200 hover:rounded-lg p-2"
                                                    onClick={() => setFilter(item)}
                                                >
                                                    {item}
                                                </button>
                                            </Menu.Item>
                                        ))
                                    }
                                </Menu.Items>
                            </Menu>
                        </>
                    }
                    
                </div>

                {
                    pathname !== '/dash/settings' &&
                    <div className="flex justify-end">
                        <button onClick={goToSetting} className="text-5xl invert">
                            <Account/>
                        </button>
                    </div>
                }
            </header>
            
            <div className="flex justify-center grow bg-cream-200 mt-20">
                <Outlet context={{user, filter, searchContent}}/>
            </div>
        </div>
    )
}

export default PrivateScreen

