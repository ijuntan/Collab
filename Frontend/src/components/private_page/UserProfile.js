import React, { useContext } from 'react'
import { Dialog } from '@headlessui/react'
import { 
    MdClear as Cancel, MdSmartButton,
} from 'react-icons/md'

import TransitionDialog from '../../utils/TransitionDialog'
import ProfilePic from '../../utils/ProfilePic'
import DateFormat from '../../utils/DateFormat'

import { useNavigate } from 'react-router-dom'
import UserService from '../../services/userService'
import { GetUser, UserContext } from '../../services/authComponent'

const UserProfile = ({
    userTarget, 
    open, 
    handleClose,
    setChatTo
}) => {
    const {setUser, fetchUser} = useContext(UserContext);

    const user = GetUser()

    const navigate = useNavigate()

    const followFriend = async() => {
        try {
            await UserService.followFriend(user._id, userTarget._id)
            setUser({...user, follows: [...user.follows, userTarget]})
            fetchUser()
        } catch (err) {
            console.log(err)
        }
    }

    const unfollowFriend = async() => {
        try {
            await UserService.unfollowFriend(user._id, userTarget._id)
            setUser({...user, follows: user.follows.filter(item => item._id !== userTarget._id)})
            fetchUser()
        } catch (err) {
            console.log(err)
        }
    }

    const alreadyFollow = () => {
        return user.follows.find(item => item._id === userTarget._id)
    }

    return (
        <TransitionDialog open={open} handleClose={handleClose}>
            <Dialog.Title
                as="h3"
                className="
                    flex items-center gap-2
                    text-2xl font-medium leading-6 text-gray-900
                "
            >
                <ProfilePic src={userTarget.profilePic}/>
                <div>{userTarget.username}</div>
                <div className="flex grow justify-end">
                    <button className="hover:opacity-50 outline-none"
                        onClick={handleClose}
                    >
                        <Cancel/>
                    </button>
                </div>
            </Dialog.Title>

            <div className="border-b mt-6"></div>

            {/* show recent posts and projects of user */}
            <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-col gap-2">
                    <div className="text-xl font-medium">
                        Recent Posts
                    </div>
                    <div className="flex flex-col gap-2">
                        {   
                        user.post.length !== 0 ?
                        user.post.map(post => (
                            <button className="flex flex-col gap-2 p-4 rounded-lg border"
                                onClick={() => navigate(`/dash/post/${post._id}`)}
                            >
                                <div className="flex gap-2">
                                    <div className="flex flex-col gap-1 items-start">
                                        <div className="text-lg font-medium">
                                            {post.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            <DateFormat date={post.createdAt} color="text-slate-800"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm" style={{
                                    whiteSpace: "pre-wrap",
                                    WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent)",
                                    maskImage: "linear-gradient(180deg, #000 60%, transparent)"
                                }}>
                                    {post.content}
                                </div>
                            </button>
                        )) :
                        <div className="text-sm">
                            No recent posts
                        </div>
                        }
                    </div>
                </div>

                <div className="border-b my-4"></div>
                
                <div className="flex flex-col gap-2">
                    <div className="text-xl font-medium">
                        Recent Projects
                    </div>
                    <div className="flex flex-col gap-2">
                        {
                            user.project.length !== 0 ?
                            user.project.map(project => (
                                <div className="flex flex-col gap-2 p-4 rounded-lg border">
                                    <div className="flex gap-2">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-lg font-medium">
                                                {project.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                <DateFormat date={project.createdAt} color="text-slate-800"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm" style={{
                                        whiteSpace: "pre-wrap",
                                        WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent)",
                                        maskImage: "linear-gradient(180deg, #000 60%, transparent)"
                                    }}
                                    >
                                        {project.content}
                                    </div>
                                </div>
                            )) : 
                            <div className="text-sm">
                                No recent projects
                            </div>
                        }
                    </div>
                </div>
            </div>
            
            <div className="flex gap-2 mt-4">
                <button
                    className="
                        bg-amber-600 text-sm text-white font-medium
                        rounded-lg px-4 py-2 border border-amber-600
                        hover:bg-amber-700 hover:border-amber-700
                    "
                    onClick={() => {
                        setChatTo(user)
                        handleClose()
                    }}
                >
                Chat
                </button>
                {
                    alreadyFollow()
                    ?
                    <button
                        className="
                            bg-amber-600 text-sm text-white font-medium
                            rounded-lg px-4 py-2 border border-amber-600
                            hover:bg-amber-700 hover:border-amber-700
                        "
                        onClick={unfollowFriend}
                    >
                    Unfollow
                    </button>
                    :
                    <button
                        className="
                            bg-amber-600 text-sm text-white font-medium
                            rounded-lg px-4 py-2 border border-amber-600
                            hover:bg-amber-700 hover:border-amber-700
                        "
                        onClick={followFriend}
                    >
                    Follow
                    </button>
                }
                
            </div>
                        
        </TransitionDialog>
    )
}

export default UserProfile