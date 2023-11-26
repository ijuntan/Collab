import React, { useContext, useState, useEffect, useMemo, Suspense, lazy } from 'react'
import {useOutletContext} from 'react-router-dom'
import { 
    MdChat,
    MdCancel,
    MdRefresh
}
from 'react-icons/md'

import UserService from '../../../services/userService'
import Chatbox from '../Chatbox'
import DateFormat from '../../../utils/DateFormat'
import { GetUser } from '../../../services/authComponent'

import Loading from '../../../utils/Loading'
import ProfilePic from '../../../utils/ProfilePic'

const UserProfile = lazy(() => import('../UserProfile'))

const DashboardSidebar = () => {
    const user = GetUser()
    const [usernameInSearch, setUsernameInSearch] = useState("")

    const [userFound, setUserFound] = useState(null)

    const [chatTo, setChatTo] = useState(null)

    const [notifications, setNotifications] = useState(null)

    const [err, setErr] = useState({
        searchUsername: ""
    })

    const fetchNotifications = async() => {
        const promise = await UserService.getNotifications(user._id)
        setNotifications(promise.data)
    }

    useEffect(() => {
        const fetchInitialNotifications = async() => {
            const promise = await UserService.getNotifications(user._id)
            setNotifications(promise.data)
        }

        fetchInitialNotifications()
    }, [])

    const searchUsername = async(username) => {
        try {
            if(username === user.username) {
                setErr(prev => ({...prev, searchUsername: "Cannot search yourself"}))
                return
            }

            const res = await UserService.getUserByName(username)
            setUserFound(res.data)
        } catch (err) {
            console.log(err)
            setErr(prev => ({...prev, searchUsername: "User not found!"}))
        }
    }    

    const updateNotification = async(id, action) => {
        try {
            await UserService.updateInvitation(id, {userAction:action})
            fetchNotifications(user._id)
        }
        catch(err) {
            console.log(err)
        }
    }

    const deleteNotification = async(id) => {
        try {
            await UserService.deleteNotification(id)
            fetchNotifications(user._id)
        }
        catch(err) {
            console.log(err)
        }
    }

    const checkNotification = async(id) => {
        try {
            await UserService.getNotification(id)
            fetchNotifications(user._id)
        }
        catch(err) {
            console.log(err)
        }
    }

    const handleCloseUserProfile = () => {
        setUserFound(null)
    }
    
    return (
        <div className="flex flex-col gap-4 grow">
            {/* Friend System */}
            <div className="p-4 rounded-lg bg-amber-700">
                {/* Search Bar */}
                <input
                    className="
                        bg-amber-800 
                        outline-none rounded-lg 
                        p-2 pr-10 w-full
                        text-white placeholder-amber-400
                        
                    "
                    value={usernameInSearch}
                    placeholder="Search Username.."
                    onChange = {e => {
                        setUsernameInSearch(e.target.value)
                        setErr(prev => ({...prev, searchUsername: ""}))
                    }}
                    onKeyDown= {e => e.key==="Enter" && searchUsername(usernameInSearch)}
                />

                {
                    // Error Message
                    err.searchUsername &&
                    <div className="text-white mt-1">
                        {err.searchUsername}
                    </div>
                }
                
                {/* User Profile Dialog */}
                {
                    userFound && 
                    <Suspense fallback={<Loading/>}>
                        <UserProfile
                            userTarget={userFound}
                            open={userFound ? true : false}
                            handleClose={handleCloseUserProfile}
                            setChatTo={setChatTo}
                        />
                    </Suspense>
                }
            </div>

            {/* Friend List */}
            <div className="flex flex-col h-80 p-4 text-gray-700 rounded-lg bg-white border gap-2">
                <div className="text-xl font-semibold">
                    Following List
                </div>
                {   user.follows?.length>0 &&
                    user.follows.map(item => (
                        <div key={item._id} className="flex">
                            <button className='flex items-center gap-2 outline-none'
                                onClick={() => searchUsername(item.username)}
                            >
                                <ProfilePic src={item.profilePic}/>
                                <div className='font-medium'>
                                    {item.username}
                                </div>
                            </button>
                            
                            <div className="flex justify-end grow">
                                <button onClick={()=> setChatTo(item)}>
                                    <MdChat/>
                                </button>
                            </div>
                        </div>
                    ))
                }
                {
                    chatTo &&
                    <Chatbox
                        open={chatTo ? true : false}
                        account={user}
                        user={chatTo}
                        setChatTo={setChatTo}
                    />
                }
                
            </div>

            <div className="flex flex-col bg-white rounded-lg min-h-post border divide-y">
                <div className='flex items-center p-4'>
                    <div className='text-xl font-semibold'>
                        Notification Bar
                    </div>

                    <MdRefresh className="ml-auto cursor-pointer hover:text-slate-700"/>
                </div>

                <div className="flex flex-col gap-2 px-4 rounded-b-lg h-full divide-y divide-gray-600">
                    {
                        notifications?.length > 0 ?
                        notifications.map(item => (
                            <div key={item._id} className="flex flex-col gap-2 py-2">
                                <div className='flex'>
                                    <div className="flex flex-grow">
                                        <button onClick={()=>checkNotification(item._id)}>
                                            {item.msg}
                                        </button>
                                        <div>
                                            {!item.isRead &&
                                                <div className="bg-red-500 rounded-lg w-2 h-2 ml-2"/>
                                            }
                                        </div>
                                    </div>
                                    

                                    <div className="flex-grow-0 mr-2">
                                        <DateFormat date={item.createdAt} color="text-amber-700"/>
                                    </div>
                                    <button onClick={()=>deleteNotification(item._id)}>
                                        <MdCancel/>
                                    </button>
                                </div>

                                {
                                    item?.projectId &&
                                    <div className='flex gap-2'>
                                    <button className='text-green-500 hover:opacity-50'
                                        onClick={() => updateNotification(item._id, "accept")}
                                    >
                                        Accept
                                    </button>
                                    
                                    {/* on hover change opacity */}
                                    <button className='text-red-500 hover:opacity-50'
                                        onClick={() => updateNotification(item._id, "decline")}
                                    >
                                        Decline
                                    </button>
                                    </div>
                                }
                            </div>
                        ))
                        :
                        <div className='text-gray-600 mt-2'>
                            No Notifications
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default DashboardSidebar