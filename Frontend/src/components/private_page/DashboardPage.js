import React, { useContext, useState, useEffect, useMemo } from 'react'
import {useNavigate, useOutletContext} from 'react-router-dom'
import { Dialog, Menu } from '@headlessui/react'
import { 
    MdExpandMore as Down,
    MdGroup as Group,
    MdEmojiPeople as FindPeople,
    MdQuestionMark as Question,
    MdOutlineLocalFireDepartment as Fire,
    MdOutlineTimelapse as Time,
    MdThumbUpOffAlt as Like,
    MdThumbDownOffAlt as Dislike,
    MdFilterList as Filter,
    MdAccountCircle as Account,
    MdShare as Share,
    MdChat,
    MdCancel
}
from 'react-icons/md'
import UserService from '../../services/userService'
import PostService from '../../services/postService'
import AddPost from './AddPost'
import UserProfile from './UserProfile'
import Chatbox from './Chatbox'
import ProfilePic from './ProfilePic'
import InfiniteScroll from 'react-infinite-scroll-component';

const sortCat = [
    "Hot",
    "New",
]

const categoryList = [
    "Website",
    "AI",
    "Electronics",
    "Science",
    "Business",
]

const DashboardPage = () => {
    const { user, searchContent } = useOutletContext();
    const [ searchFriend, setSearchFriend ] = useState("") 
    const [ friendFound, setFriendFound ] = useState(null)
    const [posts, setPosts] = useState(null)
    const [action, setAction] = useState(null)
    const [sort, setSort] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [openCreatePostDialog, setOpenCreatePostDialog] = useState(false)
    const [openLFT, setOpenLFT] = useState(false)
    const [openLFM, setOpenLFM] = useState(false)
    const [openFriend, setOpenFriend] = useState(false)
    const [chatTo, setChatTo] = useState(null)
    const [notifications, setNotifications] = useState(null)
    const [morePost, setMorePost] = useState(true)

    const history = useNavigate()

    const [post, setPost] = useState(
        {
            name: "",
            desc: "",
            tagQuestion: false
        }
    )

    const fetchPost = async() => {
        const promise = await PostService.getPost(posts? posts.length : 0)
        if(posts?.length > 0) {
            setMorePost(promise.data.length > 0)
            setPosts(prev => [...prev, ...promise.data])
        }
        else setPosts(promise.data)
    }

    const fetchPostByCategory = async() => {
        const promise = await PostService.getPostByCategory(filterCategory)
        setPosts(promise.data)
    }

    const fetchPostBySearch = async() => {
        try {
            const promise = await PostService.getPostBySearch(searchContent)
            console.log(promise.data)
            setPosts(promise.data)
        }
        catch(err){
            setPosts([]) 
        }
    }

    const fetchNotifications = async(id) => {
        const promise = await UserService.getNotifications(id)
        setNotifications(promise.data)
    }

    // useEffect(() => {
    //     if(searchContent === "") {
    //         if(filterCategory === "")
    //             fetchPost()
    //         else
    //             fetchPostByCategory()
    //     }
    //     else fetchPostBySearch()
        
    // }, [filterCategory, searchContent])

    useEffect(() => {
        // if(searchContent === "") {
        //     if(filterCategory === "")
        //         fetchPost()
        //     else
        //         fetchPostByCategory()
        // }
        // else fetchPostBySearch()
        fetchPost();
        fetchNotifications(user._id)
    }, [])

    useEffect(() => {
        const fetchAction = async(id) => {
            const promise = await PostService.getActionByUser(id)
            setAction(promise.data)
        }
        if(user._id != "") {
            fetchAction(user._id)
        }
    }, [posts])

    const findFriend = async() => {
        try {
            const friend = await UserService.getUserByName(searchFriend)
            if(friend.data.username !== user.username) {
                if(friend) setOpenFriend(true)
                setFriendFound(friend.data)
            }
            
        } catch (err) {
            console.log(err)
        }
    }

    const updateAction = (postId, act, beforeAct) => {
        const newActionState = action.map(obj => 
            obj.to === postId
            ? {...obj, action: act}
            : obj
        );
        setAction(newActionState)
        
        let linc = 0, dinc = 0;
        if(beforeAct === "Like") {
            linc = -1
            dinc = act === "Dislike" ? 1 : 0
        }
        else if(beforeAct === "Dislike") {
            dinc = -1
            linc = act === "Like" ? 1 : 0
        }
        else {
            linc = act === "Like" ? 1 : 0
            dinc = act === "Dislike" ? 1 : 0
        } 
        const newPostState = posts.map(obj => 
            obj._id === postId
            ? {...obj, like: obj.like + linc, dislike: obj.dislike + dinc}
            : obj
        );

        setPosts(newPostState)
    }

    const actionPost = async(postId, actionType) => {
        try {
            if(!action.some(e => e.to === postId)) {
                const act = {
                    accountID: user._id,
                    to: postId,
                    actionTo: "Post",
                    action: actionType
                }
                await PostService.actionToPost(act)

                updateAction(postId, actionType, "")
            }
            else {
                const act = action.find(e => e.to === postId)
                if(act.action !== actionType || act.action === "" ) {
                    const wait = await PostService.updateActionPost({
                        userID: user._id, 
                        postID: postId, 
                        act: actionType,
                        beforeAct: act.action
                    })

                    if(wait) updateAction(postId, actionType, act.action)
                }
                else {
                    const wait = await PostService.updateActionPost({
                        userID: user._id, 
                        postID: postId, 
                        act: "",
                        beforeAct: act.action
                    })

                    if(wait) updateAction(postId, "", act.action)
                }
            }
    
        } catch(err) {
            console.log(err)
        }
    }
    
    const inAction = (id, act) => {
        return action.some(e => e.to === id && e.action === act)
    }

    const dateDiff = (createdAt, color="text-slate-200") => {
        const now = new Date()
        const postDate = new Date(createdAt)
        const diff = Math.floor((now - postDate)/ (1000 * 3600 * 24))
        let text = ""

        if(diff < 1) text="Today"
        else if(diff > 30) text= Math.floor(diff/30) + " Months Ago"
        else text= diff + " Days Ago"

        return(
            <div className={`${color} text-xs mt-1`}>
                {text}
            </div>
        )
    }

    const updateNotif = async(id, action) => {
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

    const checkNotif = async(id) => {
        try {
            await UserService.getNotification(id)
            fetchNotifications(user._id)
        }
        catch(err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className="grow"/>
            
            {/* Main Screen */}
            <div className="flex grow py-4 gap-6">
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
                                <ProfilePic/>

                                <button className="
                                    grow outline-none rounded-lg border
                                    bg-transparent 
                                    p-2 w-full cursor-text
                                    placeholder-white text-white text-left
                                "
                                    onClick={()=> {
                                        setPost(prev => ({...prev, tagQuestion: false}))
                                        setOpenCreatePostDialog(true)
                                    }}
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
                                            function: ()=> {
                                                setPost(prev => ({...prev, tagQuestion: true}))
                                                setOpenCreatePostDialog(true)
                                            }
                                        },
                                        {
                                            logo: <Group/>,
                                            name: "Looking for team",
                                            function: ()=>setOpenLFT(true)
                                        },
                                        {
                                            logo: <FindPeople/>,
                                            name: "Looking for members",
                                            function: ()=>setOpenLFM(true)
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
                            bg-amber-700 shadow-md shadow-slate-400
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
                                        flex p-2 rounded-lg
                                        text-white font-medium
                                        hover:bg-amber-800
                                        ${sort === item.name && "bg-amber-800"}
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
                                <button className="
                                    flex items-center p-2 rounded-lg
                                    text-white font-medium
                                    hover:bg-amber-800
                                ">
                                    Filter
                                    <Down/>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Post  */}
                    
                    <InfiniteScroll
                        dataLength={posts?.length || 0}
                        next={fetchPost}
                        hasMore={morePost}
                        loader={<div>Loading ...</div>}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                              <b>Yay! You have seen it all</b>
                            </p>
                        }
                        className="flex flex-col gap-4"
                    >
                        { posts && posts.map(item => (
                            // Post Card
                            <div
                                key={item._id}
                                className=" 
                                    flex flex-col rounded-lg
                                    shadow-md shadow-slate-400 divide-y
                                "
                            >
                                {/* Title */}
                                <div className="
                                    flex flex-col gap-2 bg-amber-700
                                    p-4 rounded-t-lg
                                    text-white
                                "
                                >
                                    <div className="
                                        flex gap-2 items-center
                                    ">
                                        <img className='rounded-full w-10 h-10 bg-gray-200 object-cover' src={item.createdBy.profilePic || "/images/profile.svg"}/>
                                        {item.createdBy.username}
                                        {dateDiff(item.createdAt)}
                                    </div>
                                    
                                    <div className="
                                        flex gap-2
                                    ">
                                        <button
                                            className="
                                                max-w-sm truncate
                                                font-medium text-lg
                                            "
                                            onClick={() => history(`post/${item._id}`)}
                                        >
                                            {item.name}
                                        </button>

                                        <div className='grow'/>

                                        <div className={
                                            `${!(item.tag !== "normal") && "hidden"}
                                                text-cream-200 border border-cream-200 px-2
                                                rounded-lg
                                            `
                                        }
                                        >
                                            {item.tag.toUpperCase()}
                                        </div>
                                    </div>

                                    <div className='flex gap-2'>
                                        {
                                            item.category.map(cat => (
                                                <div key={cat} className="
                                                    text-black bg-cream-200 px-2
                                                    rounded-lg
                                                ">
                                                    {cat}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                
                                {/* Content */}
                                <div
                                className="
                                    bg-white max-h-36 overflow-hidden
                                    px-4 py-2 whitespace-pre
                                    text-slate-800
                                ">
                                    {item.content}
                                </div>

                                {/* Actions */}
                                <div className="
                                    flex items-center gap-2
                                    bg-white font-medium
                                    px-4 py-2 rounded-b-lg
                                ">
                                    <button className={`
                                        text-2xl p-2 rounded-lg hover:bg-slate-300
                                        ${inAction(item._id, "Like")?'text-green-600':'text-black'}
                                    `}
                                    onClick={() => actionPost(item._id, "Like")}
                                    
                                    >
                                        <Like/>
                                    </button>

                                    <div>
                                        {item.like}
                                    </div>

                                    <button className={`
                                        text-2xl p-2 rounded-lg hover:bg-slate-300
                                        ${inAction(item._id, "Dislike")?'text-red-600':'text-black'}
                                    `}
                                    onClick={() => actionPost(item._id, "Dislike")}
                                    >
                                        <Dislike/>
                                    </button>

                                    <div>
                                        {item.dislike}
                                    </div>

                                    <button className={`
                                        text-2xl p-2 rounded-lg hover:bg-slate-300
                                    `}
                                    //onClick={() => actionPost(item._id, "Dislike")}
                                    >
                                        <Share/>
                                    </button>
                                </div>
                            </div>
                        ))}
                                        
                    </InfiniteScroll>
                </div>
                
                {/* Friend System */}
                <div className="flex flex-col gap-4 grow">
                    <div className="p-4 rounded-lg bg-amber-700">
                        {/* Search Bar */}
                        <input
                            className="
                                bg-amber-800 
                                outline-none rounded-lg 
                                p-2 pr-10 w-full
                                text-white placeholder-amber-400
                                focus:border
                            "
                            value={searchFriend}
                            placeholder="Search Friends.."
                            onChange = {e => setSearchFriend(e.target.value)}
                            onKeyDown= {e => e.key==="Enter" && findFriend(friendFound)}
                        />
                        {/* User Profile Dialog */}
                        {
                            openFriend && 
                            <UserProfile
                                account={user}
                                user={friendFound}
                                open={openFriend}
                                setOpen={setOpenFriend}
                                setChatTo={setChatTo}
                            />
                        }
                    </div>

                    {/* Friend List */}
                    <div className="flex flex-col h-80 p-4 text-white rounded-lg bg-amber-700 gap-2">
                        <div className="text-xl">
                            Following List
                        </div>
                        {   user.follows?.length>0 &&
                            user.follows.map(item => (
                                <div key={item._id} className="flex text-white">
                                    <button className='flex items-center gap-2'
                                        onClick={()=>{
                                            setOpenFriend(true)
                                            setFriendFound(item)
                                        }}
                                    >
                                        <img className='rounded-full w-10 h-10 bg-gray-200 object-cover' src={item.profilePic || "/images/profile.svg"}/>
                                        {item.username}
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

                    <div className="flex flex-col bg-amber-600 rounded-lg min-h-post">
                        <div className='text-white font-bold p-4'>
                            Notification Bar
                        </div>

                        <div className="flex flex-col gap-2 p-4 bg-amber-200 rounded-b-lg h-full shadow-lg divide-y divide-amber-600">
                            {
                                notifications?.length > 0 ?
                                notifications.map(item => (
                                    <div key={item._id} className="flex flex-col gap-2 pt-2">
                                        <div className='flex'>
                                            <div className="flex flex-grow">
                                                <button onClick={()=>checkNotif(item._id)}>
                                                    {item.msg}
                                                </button>
                                                <div>
                                                    {!item.isRead &&
                                                        <div className="bg-red-500 rounded-lg w-2 h-2 ml-2"/>
                                                    }
                                                </div>
                                            </div>
                                            

                                            <div className="flex-grow-0 mr-2">
                                                {dateDiff(item.createdAt, "text-amber-700")}
                                            </div>
                                            <button onClick={()=>deleteNotification(item._id)}>
                                                <MdCancel/>
                                            </button>
                                        </div>

                                        {
                                            item?.projectId &&
                                            <div className='flex gap-2'>
                                            <button className='text-green-500 hover:opacity-50'
                                                onClick={() => updateNotif(item._id, "accept")}
                                            >
                                                Accept
                                            </button>
                                            
                                            {/* on hover change opacity */}
                                            <button className='text-red-500 hover:opacity-50'
                                                onClick={() => updateNotif(item._id, "decline")}
                                            >
                                                Decline
                                            </button>
                                            </div>
                                        }
                                    </div>
                                ))
                                :
                                <div>
                                    No Notification
                                </div>
                            }
                        </div>
                    </div>
                </div>

            </div>

            {/* Dialog for create post */}
            <AddPost
                open={openCreatePostDialog}
                setOpen={setOpenCreatePostDialog}
                openLFT={openLFT}
                setOpenLFT={setOpenLFT}
                openLFM={openLFM}
                setOpenLFM={setOpenLFM}
                post={post}
                setPost={setPost}
                categoryList={categoryList}
            /> 
            
            <div className="grow"/>
        </>
    )
}

export default DashboardPage