import React, { useEffect, useMemo, useState } from 'react'

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
}
from 'react-icons/md'

import InfiniteScroll from 'react-infinite-scroll-component';

import DateFormat from '../../../utils/DateFormat';

import { useNavigate, useOutletContext } from 'react-router-dom';
import PostService from '../../../services/postService';
import ProfilePic from '../../../utils/ProfilePic';
import { GetUser } from '../../../services/authComponent';
import Loading from '../../../utils/Loading';
import { Popover } from '@headlessui/react';

const DashboardMainFeed = ({
    sort,
    searchContent
}) => {
    
    const user = GetUser()

    const navigate = useNavigate();

    const [posts, setPosts] = useState([])
    const [morePost, setMorePost] = useState(true)

    const [action, setAction] = useState([])

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
            loader={<div>Loading...</div>}
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
                    <button className="
                        flex flex-col gap-2 bg-white
                        p-4 rounded-t-lg
                    "
                    onClick={() => navigate(`post/${item._id}`)}
                    >
                        <div className="flex gap-2 items-center">
                            <ProfilePic src={item.createdBy.profilePic}/>

                            <div className='flex flex-col items-start'>
                                <div className='text-black font-medium'>
                                    {item.createdBy.username}
                                </div>
                                <DateFormat date={item.createdAt} color="text-slate-700"/>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 items-center">
                            <div
                                className="
                                    max-w-sm truncate
                                    font-medium text-lg 
                                "
                            >
                                {item.name}
                            </div>

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
                    </button>
                    
                    {/* Content */}

                    <div
                        className="
                            max-h-36 
                            px-4 py-2 whitespace-pre
                            text-slate-800
                        "
                        style={{
                            WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent)",
                            maskImage: "linear-gradient(180deg, #000 60%, transparent)"
                        }}
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
                    </div>
                </div>
            ))}
                        
        </InfiniteScroll>
    )
}

export default DashboardMainFeed