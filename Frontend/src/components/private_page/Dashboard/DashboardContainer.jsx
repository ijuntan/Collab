import React, { useContext, useState, useEffect, useMemo, Suspense, lazy } from 'react'
import {useOutletContext} from 'react-router-dom'
import { 
    MdExpandMore as Down,
    MdGroup as Group,
    MdEmojiPeople as FindPeople,
    MdQuestionMark as Question,
    MdOutlineLocalFireDepartment as Fire,
    MdOutlineTimelapse as Time,
    MdChat,
    MdCancel
}
from 'react-icons/md'
import UserService from '../../../services/userService'
import UserProfile from '../UserProfile'
import Chatbox from '../Chatbox'
import ProfilePic from '../../../utils/ProfilePic'
import Loading from '../../../utils/Loading'
import DashboardMainFeed from './DashboardMainFeed'
import DateFormat from '../../../utils/DateFormat'
import DashboardSidebar from './DashboardSidebar'
import { Menu } from '@headlessui/react'
import { postCategory } from '../AddPost/category'

const AddPostNavigation = lazy(() => import('../AddPost/AddPostNavigation'))

const sortCat = [
    "Hot",
    "New",
]

const DashboardContainer = () => {
    const {searchContent} = useOutletContext()
    const [sort, setSort] = useState("")

    const [openAddPost, setOpenAddPost] = useState("")

    return (
        <>
            <div className="grow"/>
            
            {/* Main Screen */}
            <div className="flex w-400 py-4 gap-4">
                <div className="flex flex-col grow-[2] gap-4 overflow-auto">
                    {/* Create Post */}
                    <div className="flex justify-center">
                        {/* Card for Create Post */}
                        <div className="
                            flex flex-col w-full
                            p-3 rounded-lg gap-3
                            bg-amber-700 shadow-md shadow-slate-400
                        ">
                            {/* First Row */}
                            <div className="flex gap-3 items-center">
                                <ProfilePic src="self"/>

                                <button className="
                                    grow outline-none rounded-lg border
                                    bg-transparent 
                                    p-2 w-full cursor-text
                                    placeholder-white text-white text-left
                                "
                                    onClick={()=> setOpenAddPost("normal")}
                                >
                                    Create a post
                                </button>
                            </div>
                            
                            {/* Second Row */}
                            <div className="flex justify-around text-amber-400">
                                {
                                    [
                                        {
                                            logo: <Question/>,
                                            name: "Ask a question",
                                            function: () => setOpenAddPost("question")
                                        },
                                        {
                                            logo: <Group/>,
                                            name: "Looking for team",
                                            function: () => setOpenAddPost("LFT")
                                        },
                                        {
                                            logo: <FindPeople/>,
                                            name: "Looking for members",
                                            function: () => setOpenAddPost("LFM")
                                        }
                                    ].map(item => (
                                        <button key={item.name} className="
                                            flex items-center gap-2 p-2
                                            rounded-lg
                                            hover:bg-amber-600/75
                                        "
                                        onClick={item.function}
                                        >
                                            <div className="text-3xl">
                                                {item.logo}
                                            </div>
                                            
                                            <div className="text-md">
                                                {item.name}
                                            </div>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    {/* Filter Post */}
                    <div className="flex justify-center">
                        <div className="
                            flex w-full
                            p-3 rounded-lg gap-3
                            bg-white border
                        ">
                            {
                                [
                                    {
                                        name:"Hot",
                                        logo:<Fire/>
                                    },
                                    {
                                        name:"New",
                                        logo:<Time/>
                                    },
                                ].map(item => (
                                    <button key={item.name} 
                                    className={`
                                        flex py-2 px-3 rounded-full gap-1
                                        font-medium
                                        hover:bg-gray-200
                                        ${sort === item.name ? "bg-gray-200 text-amber-800" : "text-slate-800"}
                                    `}
                                    onClick={()=> {sort === item.name ? setSort("") : setSort(item.name)}}
                                    >
                                        <div className="text-2xl">
                                            {item.logo}
                                        </div>
                                        {item.name}
                                    </button>
                                ))
                            }
                            <div className="flex grow justify-end">
                                {
                                    sort &&
                                    <button className="hover:opacity-50"
                                        onClick={() => setSort("")}
                                    >
                                        <MdCancel/>
                                    </button>
                                }
                                <Menu>
                                    {({open}) => (
                                    <div className='relative'>
                                    <Menu.Button
                                        className={`flex items-center gap-2 p-2 rounded-lg outline-none transition-all delay-100 ${open ? "bg-gray-100" : ""}`}
                                    >
                                        {sort ? sort : "Filter"}
                                        <Down/>
                                    </Menu.Button>

                                    <Menu.Items className="absolute top-12 right-1 bg-white outline-none border rounded-lg flex flex-col max-h-44 overflow-auto">
                                        {
                                            postCategory.map(item => (
                                                <Menu.Item key={item}>
                                                        <button className={`
                                                            flex items-center justify-center gap-2 p-2 rounded-lg
                                                            hover:bg-gray-200
                                                        `}
                                                        onClick={()=> setSort(item)}
                                                        >
                                                            {item}
                                                        </button>
                                                </Menu.Item>
                                            ))
                                        }
                                    </Menu.Items>
                                    </div>
                                    )}
                                </Menu>
                            </div>
                        </div>
                    </div>

                    {/* Post  */}
                    <DashboardMainFeed
                        sort={sort}
                        searchContent={searchContent}
                    />
                </div>
                
                <DashboardSidebar/>

            </div>
            
            {
            /* Dialog for create post */
            openAddPost &&

            <Suspense fallback={<Loading/>}>
                <AddPostNavigation
                    open={openAddPost}
                    setOpen={setOpenAddPost}
                /> 
            </Suspense>
            
            }
            
            <div className="grow"/>
        </>
    )
}

export default DashboardContainer