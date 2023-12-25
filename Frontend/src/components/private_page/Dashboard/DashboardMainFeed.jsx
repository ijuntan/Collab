import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react'

import { 
    MdThumbUpOffAlt as Like,
    MdThumbDownOffAlt as Dislike,
    MdShare as Share,
    MdOutlinePersonSearch,
    MdQuestionMark,
    MdGroup,
    MdCancel,
    MdClose,
    MdComment,
    MdLink,
}
from 'react-icons/md'

import { Popover } from '@headlessui/react'

import InfiniteScroll from 'react-infinite-scroll-component';

import DateFormat from '../../../utils/DateFormat';

import { useNavigate, useOutletContext } from 'react-router-dom';
import PostService from '../../../services/postService';
import ProfilePic from '../../../utils/ProfilePic';
import { GetUser } from '../../../services/authComponent';
import Loading from '../../../utils/Loading';
import Chatbox from '../Chatbox'
import { postCategory } from '../AddPost/category';
import userService from '../../../services/userService';
const UserProfile = lazy(() => import('../UserProfile'))

const DashboardMainFeed = ({
    sort,
    searchContent
}) => {
    
    const user = GetUser()

    const navigate = useNavigate();

    const [posts, setPosts] = useState([])
    const [morePost, setMorePost] = useState(true)

    const [action, setAction] = useState([])
    const [chatTo, setChatTo] = useState(null)
    const [userFound, setUserFound] = useState(null)
    const handleCloseUserProfile = () => {
        setUserFound(null)
    }

    const searchUsername = async(username) => {
        try {
            const res = await userService.getUserByName(username)
            setUserFound(res.data)
        } catch (err) {
            console.log(err)
        }
    }    

    const fetchMorePost = async() => {
        const promise = await PostService.getPost(posts.length)

        if(promise.data.length === 0) {
            setMorePost(false)
            return
        }

        //check for duplicate
        const newPost = promise.data.filter(obj => !posts.some(e => e._id === obj._id))

        if(newPost.length > 0)
            setPosts(prev => prev.concat(newPost))
        else if(morePost)
            fetchMorePost()
    }

    const inAction = (id, act) => {
        return action?.some(e => e.to === id && e.action === act)
    }

    const updateAction = (postId, act, beforeAct) => {
        if(!action?.some(e => e.to === postId)) {
            const newActionState = [...action, {accountID: user._id, to: postId, actionTo:"Post", action: act}]
            setAction(newActionState)
        }
        else {
            const newActionState = action.map(obj =>
                obj.to === postId
                ? {...obj, action: act}
                : obj
            )
            setAction(newActionState)
        }
        
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
            //Create New Action
            if(!action?.some(e => e.to === postId)) {
                const actionToSubmit = {
                    accountID: user._id,
                    to: postId,
                    actionTo: "Post",
                    action: actionType
                }
                await PostService.actionToPost(actionToSubmit)

                updateAction(postId, actionType, "None")
            }
            //Update Action
            else {
                const act = action.find(e => e.to === postId)
                const actionTypeToSubmit = (act.action === "None" || act.action !== actionType) ? actionType : "None";

                await PostService.updateActionPost({
                    userID: user._id, 
                    postID: postId, 
                    act: actionTypeToSubmit,
                    beforeAct: act.action
                })

                updateAction(postId, actionTypeToSubmit, act.action)
            }
    
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        let ignore = false;

        const fetchInitialPost = async() => {
            const promise = await PostService.getPost(0)
            if(!ignore) setPosts(promise.data)
        }

        const fetchAction = async(id) => {
            const promise = await PostService.getActionByUser(id)
            if(!ignore) setAction(promise.data)
        }

        fetchInitialPost();
        fetchAction(user._id)

        return () => {
            ignore = true;
        };
    }, [])

    const postsData = useMemo(() => {
        if(searchContent === "") {
            if(sort === "Hot") {
                const newPosts = [...posts]
                newPosts.sort((a, b) => (a.like - a.dislike) < (b.like - b.dislike) ? 1 : -1)
                return newPosts
            }
            else if(sort === "New") {
                const newPosts = [...posts]
                newPosts.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1)
                return newPosts
            }
            else if(postCategory.includes(sort)) {
                const newPosts = [...posts]
                return newPosts.filter(post => post.category.includes(sort))
            }
            return posts
        }
        return posts.filter(post => {
            const content = post.name + " " + post.content
            return content.toLowerCase().includes(searchContent.toLowerCase())
        })
    }, [posts, sort, searchContent])

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={fetchMorePost}
            hasMore={morePost}
            loader={<div>No posts yet..</div>}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
                </p>
            }
            className="flex flex-col gap-4"
        >
            { postsData && postsData.map(item => (
                // Post Card
                <div
                    key={item._id}
                    className=" 
                        flex flex-col rounded-lg
                        border bg-white
                    "
                >
                    {/* Title */}
                    <div className="
                        flex flex-col gap-2 bg-white
                        p-4 rounded-t-lg
                    "
                    >
                        <div className="flex gap-2 items-center">
                            <ProfilePic src={item.createdBy.profilePic}/>

                            <div className='flex flex-col items-start'>
                                <button className='text-black font-medium hover:underline'
                                    onClick={() => {
                                        if(item.createdBy._id !== user._id)
                                            searchUsername(item.createdBy.username)
                                    }}
                                >
                                    {item.createdBy.username}
                                </button>
                                <DateFormat date={item.createdAt} color="text-slate-700"/>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 items-center">
                            <button
                                className="
                                    max-w-sm truncate
                                    font-medium text-lg 
                                "
                                
                                onClick={() => navigate(`post/${item._id}`)}
                            >
                                {item.name}
                            </button>

                            {
                                item.tag !== "normal" && 
                                {
                                    "question":
                                    <div className={`text-red-700`}>
                                        <MdQuestionMark/>
                                    </div>,
                                    "LFT":
                                        <MdGroup/>,
                                    "LFM":
                                        <MdOutlinePersonSearch/>,
                                }[item.tag]
                            }

                            {
                                item.project &&
                                <button className="text-slate-800 hover:text-green-700" onClick={() => navigate(`/dash/project/${item.project}`)}>
                                    <MdLink/>
                                </button>
                            }
                        </div>

                        {
                            item.category.length !== 0 &&
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
                        }
                    </div>
                    
                    {/* Content */}

                    <div
                        className="
                            max-h-36
                            px-4 py-2 whitespace-pre-wrap
                            text-slate-800 cursor-pointer
                        "
                        style={{
                            WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent)",
                            maskImage: "linear-gradient(180deg, #000 60%, transparent)"
                        }}
                        onClick={() => navigate(`post/${item._id}`)}
                    >
                        {item.content}
                    </div>

                    {
                        item.image &&
                        <img
                            src={item.image}
                            className="p-2 object-scale-down w-full h-96 w-auto"
                        />
                    }

                    {/* Actions */}
                    <div className="
                        flex items-center gap-2
                        bg-white font-medium
                        px-4 py-2 rounded-b-lg
                        text-gray-700
                    ">
                        <button className={`
                            text-2xl p-2 rounded-lg hover:bg-slate-300
                            ${inAction(item._id, "Like")&&'text-green-600'}
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
                            ${inAction(item._id, "Dislike")&&'text-red-600'}
                        `}
                        onClick={() => actionPost(item._id, "Dislike")}
                        >
                            <Dislike/>
                        </button>

                        <div>
                            {item.dislike}
                        </div>

                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                <Popover.Button className={`
                                    flex items-center gap-2 text-2xl p-2 rounded-lg hover:bg-slate-300
                                `}
                                //copy to clipboard
                                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/dash/post/${item._id}`)}
                                >
                                    <Share/>
                                    <span className='text-sm'>Share</span>
                                </Popover.Button>

                                <Popover.Panel className="flex items-center gap-2 absolute z-10 w-48 p-4 bg-white rounded-lg shadow-lg text-sm border">
                                    <div>Copied to Clipboard!</div>
                                    <button onClick={() => close()}>
                                        <MdClose/>
                                    </button>
                                </Popover.Panel>
                                </>
                            )}
                        </Popover>

                        <button className='flex text-2xl items-center gap-2 rounded-lg hover:bg-slate-300 p-2'
                        onClick={() => navigate(`post/${item._id}`)}
                        >
                            <MdComment/>
                            <div className='text-sm'>
                                Comment
                            </div>
                        </button>
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
                </div>
            ))}
                        
        </InfiniteScroll>
    )
}

export default DashboardMainFeed