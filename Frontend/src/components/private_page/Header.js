import React, { useContext, useState } from 'react'

import { Menu } from '@headlessui/react'

import {
    MdExpandMore as Down,
    MdArticle,
    MdAutoStories,
    MdDashboard,
    MdLogout,
    MdSettings,
    MdSearch as Search
} from 'react-icons/md'

import ProfilePic from '../../utils/ProfilePic'

import { useNavigate } from 'react-router-dom'

import { GetUser } from '../../services/authComponent'
import { MainContext } from '../../services/MainContext'
import AuthService from '../../services/authService'

const Header = ({
    searchContent,
    setSearchContent
}) => {
    const user = GetUser()
    const { setJwt } = useContext(MainContext)

    const [header, setHeader] = useState("Home")

    const navigate = useNavigate()

    const navigateTo = (link, name) => {
        navigate(link)
        setHeader(name)
    }

    const goToSetting = () => {
        navigate('settings')
    }

    const Logout = () => {
        AuthService.logout()
        setJwt('')
        navigate('/')
    }

    return (
        <header className="
            flex fixed
            z-50
            h-20 w-full
            bg-white
            drop-shadow-2xl
        ">
            <div className="grow"/>
            <div className="flex grow-[2]">
                {/* Logo and Search Bar */}
                <div className="flex grow gap-4 justify-center items-center">
                    {/* Logo */}
                    <button onClick={()=>navigate('/dash')}>
                        <img
                            src="/images/collab.png"
                            className="h-10"
                        />
                    </button>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            className="
                                bg-amber-800/50 rounded-full
                                outline-none
                                w-96 py-2 px-4
                                text-white placeholder-white
                                focus:border
                            "
                            value={searchContent}
                            placeholder="What are you interested in?"
                            onChange = {e => setSearchContent(e.target.value)}
                        />
                        {/* Search Logo */}
                        <div className="
                            absolute right-4 top-1/4
                            text-amber-400 text-xl
                        ">
                            <Search/>
                        </div>
                    </div>
                </div>

                {/* Other Menus */}
                <div className="flex grow gap-2 justify-center items-center">
                    {
                        [
                            {
                                link: '/dash',
                                text: 'Home',
                                icon: <MdDashboard className='text-2xl'/>
                            },
                            {
                                link: 'post',
                                text: 'Posts',
                                icon: <MdArticle className='text-2xl'/>
                            },
                            {
                                link: 'project',
                                text: 'Projects',
                                icon: <MdAutoStories className='text-2xl'/>
                            }
                        ].map((item, index) => (
                            <button className={`
                                flex flex-col justify-center items-center h-full 
                                text-gray-500 px-2
                                hover:text-gray-800
                                ${header === item.text && "text-gray-800"}
                            `}
                                onClick={()=>navigateTo(item.link, item.text)}
                                key={index}
                            >
                                {item.icon}
                                <div className='text-sm'>
                                    {item.text}
                                </div>
                            </button>
                        ))
                    }

                    {/* Account */}
                    <div className="flex justify-end">
                        <Menu>
                            {({open}) => (
                            <>
                            <Menu.Button
                                className={`flex items-center gap-2 border p-2 rounded-full outline-none ${open ? "bg-gray-100" : ""}`}
                            >
                                <ProfilePic src="self"/>
                                <div className='text-gray-800'>
                                    {user.username}
                                </div>
                                <Down/>
                            </Menu.Button>

                            <Menu.Items className="absolute top-20 bg-white outline-none border rounded-lg">
                                <Menu.Item>
                                    <button
                                        className="
                                            flex items-center
                                            text-gray-600
                                            hover:underline
                                            px-4 py-2
                                            w-full
                                        "
                                        onClick={goToSetting}
                                    >
                                        <MdSettings className="mr-2"/>
                                        Settings
                                    </button>
                                </Menu.Item>
                                <Menu.Item>
                                    <button
                                        className="
                                            flex items-center
                                            text-gray-600
                                            hover:underline
                                            px-4 py-2
                                            w-full
                                        "
                                        onClick={Logout}
                                    >
                                        <MdLogout className="mr-2"/>
                                        Logout
                                    </button>
                                </Menu.Item>
                            </Menu.Items>
                            </>
                            )}
                        </Menu>
                    </div>
                </div>
            </div>

            <div className="grow"/>
        </header>
    )
}

export default Header