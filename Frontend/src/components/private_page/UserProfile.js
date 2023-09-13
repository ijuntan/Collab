import React, { Fragment, useContext } from 'react'
import { Dialog, Transition} from '@headlessui/react'
import { 
    MdAccountCircle as Account,
    MdCancel as Cancel,
} from 'react-icons/md'

import UserService from '../../services/userService'
import { UserContext } from '../../services/authComponent'

const UserProfile = ({
    account,
    user, 
    open, 
    setOpen,
    setChatTo
}) => {
    const {fetchUser} = useContext(UserContext);
    
    const followFriend = async() => {
        try {
            await UserService.followFriend(account._id, user._id)
            fetchUser()
            setOpen(false)
        } catch (err) {
            console.log(err)
        }
    }

    const unfollowFriend = async() => {
        try {
            await UserService.unfollowFriend(account._id, user._id)
            fetchUser()
            setOpen(false)
        } catch (err) {
            console.log(err)
        }
    }

    const alreadyFollow = () => {
        return account.follows.find(item => item._id === user._id)
    }

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={()=>setOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        {
                            user 
                            ?
                            <Dialog.Panel className="
                                w-full max-w-4xl transform overflow-hidden rounded-2xl 
                                bg-white p-6 text-left align-middle shadow-xl transition-all
                            ">
                                <Dialog.Title
                                    as="h3"
                                    className="
                                        flex items-center gap-2
                                        text-2xl font-medium leading-6 text-gray-900
                                    "
                                >
                                    <img className='border rounded-full w-10 h-10 bg-gray-200 object-contain' src={user.profilePic || "/images/profile.svg"}/>
                                    {user.username}
                                    <div className="flex grow justify-end">
                                        <button className="hover:opacity-50"
                                            onClick={() => setOpen(false)}
                                        >
                                            <Cancel/>
                                        </button>
                                    </div>
                                </Dialog.Title>
                                
                                {/* show recent posts and projects of user */}
                                {/* <div className="flex flex-col gap-2 mt-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="text-lg font-medium">
                                            Recent Posts
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {
                                                user.posts.map(post => (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex gap-2">
                                                            <img className='border rounded-full w-10 h-10 bg-gray-200 object-contain' src={user.profilePic || "/images/profile.svg"}/>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="text-sm font-medium">
                                                                    {user.username}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {post.createdAt}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm">
                                                            {post.content}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="text-lg font-medium">
                                            Recent Projects
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {
                                                user.projects.map(project => (
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex gap-2">
                                                            <img className='border rounded-full w-10 h-10 bg-gray-200 object-contain' src={user.profilePic || "/images/profile.svg"}/>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="text-sm font-medium">
                                                                    {user.username}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {project.createdAt}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm">
                                                            {project.content}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div> */}
                                
                                <div className="flex gap-2 mt-4">
                                    <button
                                        className="
                                            bg-amber-600 text-sm text-white font-medium
                                            rounded-lg px-4 py-2 border border-amber-600
                                            hover:bg-amber-700 hover:border-amber-700
                                        "
                                        onClick={() => {
                                            setChatTo(user)
                                            setOpen(false)
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
                            </Dialog.Panel>
                            :
                            <Dialog.Panel className="
                                w-full max-w-4xl transform overflow-hidden rounded-2xl 
                                bg-white p-6 text-left align-middle shadow-xl transition-all
                            ">
                                <Dialog.Title
                                    as="h3"
                                    className="
                                        flex items-center gap-2
                                        text-2xl font-medium leading-6 text-gray-900
                                    "
                                >
                                    No Username Found
                                    <div className="flex grow justify-end">
                                        <button className="hover:opacity-50"
                                            onClick={() => setOpen(false)}
                                        >
                                            <Cancel/>
                                        </button>
                                    </div>
                                </Dialog.Title>
                            </Dialog.Panel>
                        }
                        
                    </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default UserProfile