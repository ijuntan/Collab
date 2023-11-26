import React, { useEffect, useState } from 'react'

import { 
    MdThumbUpOffAlt as Like,
    MdThumbDownOffAlt as Dislike,
    MdShare as Share,
    MdOutlinePersonSearch,
    MdQuestionMark,
    MdGroup,
}
from 'react-icons/md'

import InfiniteScroll from 'react-infinite-scroll-component';

import DateFormat from '../../../utils/DateFormat';

import { useNavigate, useOutletContext } from 'react-router-dom';
import PostService from '../../../services/postService';
import ProfilePic from '../../../utils/ProfilePic';
import { GetUser } from '../../../services/authComponent';
import Loading from '../../../utils/Loading';

const DashboardMainFeed = () => {
    
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
            if(!action?.some(e => e.to === postId)) {
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
        return action?.some(e => e.to === id && e.action === act)
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
            { posts && posts.map(item => (
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
    )
}

export default DashboardMainFeed