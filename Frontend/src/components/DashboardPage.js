import React, { useContext, useState, useEffect, useMemo } from 'react'
import {useNavigate, useOutletContext} from 'react-router-dom'
import { Menu } from '@headlessui/react'
import { 
    MdExpandMore as Down,
    MdOutlineLocalFireDepartment as Fire,
    MdOutlineTimelapse as Time,
    MdThumbUpOffAlt as Like,
    MdThumbDownOffAlt as Dislike
}
from 'react-icons/md'
import Sidebar from './Sidebar'

import PostService from '../services/postService'

const sortCat = [
    "Hot",
    "Newest",
]

const DashboardPage = () => {
    const { user, filter, searchContent } = useOutletContext();
    const [posts, setPosts] = useState([])
    const [action, setAction] = useState([])
    const [sort, setSort] = useState("")
    const history = useNavigate()

    useEffect(() => {
        const fetchPost = async() => {
            const promise = await PostService.getPost()
            setPosts(promise.data)
        }
    
        const fetchPostByCategory = async() => {
            const promise = await PostService.getPostByCategory(filter)
            setPosts(promise.data)
        }
    
        const fetchPostBySearch = async() => {
            const promise = await PostService.getPostBySearch(searchContent)
            setPosts(promise.data)
        }

        if(searchContent === "") {
            if(filter === "None")
                fetchPost()
            else
                fetchPostByCategory()
        }
        else fetchPostBySearch()
        
    }, [ ,filter, searchContent])

    useEffect(() => {
        const fetchAction = async(id) => {
            const promise = await PostService.getActionByUser(id)
            setAction(promise.data)
        }
        if(user._id != "") {
            fetchAction(user._id)
        }
    }, [posts])

    const addPost = async() => {
        history('addpost')   
    }

    const updateAction = (postId, act, beforeAct) => {
        const newActionState = action.map(obj => 
            obj.to === postId
            ? {...obj, action: act}
            : obj
        );
        setAction(newActionState)
        
        let inc = 0;
        if(beforeAct === "Like") {
            inc = act === "Dislike" ? -2 : -1
        }
        else if(beforeAct === "Dislike") {
            inc = act === "Like" ? 2 : 1
        }
        else {
            inc = act === "Like" ? 1 : -1
        } 
        const newPostState = posts.map(obj => 
            obj._id === postId
            ? {...obj, like: obj.like + inc}
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

    return (
        <div className="flex justify-center w-screen">
            
            {/* <Sidebar/> */}

            <div className="flex flex-col p-8 gap-8">
                <div className="flex gap-2 p-2 border border-2 border-black rounded-lg">

                    <button title="Sort by Like"
                        className={`flex text-xl p-1 pr-2 rounded-lg border
                            ${sort === sortCat[0] ? 'border-black' : 'border-white'}
                            hover:bg-amber-700 hover:text-white hover:border-white
                        `}
                        onClick = {() => {sort === sortCat[0] ? setSort("") : setSort(sortCat[0])}}
                    >
                        <Fire/>
                        <div className="text-sm">
                            Hot
                        </div>
                    </button>

                    <button title="Sort by Time"
                        className={`flex text-xl p-1 pr-2 rounded-lg border 
                            ${sort === sortCat[1] ? 'border-black' : 'border-white'}
                            hover:bg-amber-700 hover:text-white hover:border-white
                        `}
                        onClick = {() => {sort === sortCat[1] ? setSort("") : setSort(sortCat[1])}}
                    >
                        <Time/>
                        <div className="text-sm">
                            Newest
                        </div>
                    </button>
                </div>
                {
                    posts.map((item, index) => (
                        <div className="flex gap-2 -ml-10" key={index}>
                            <div className="flex flex-col justify-end">
                                <div className="flex justify-center mb-4 font-bold">
                                    {item.like}
                                </div>

                                <button title="Like post"
                                    className={`
                                        text-3xl 
                                        ${inAction(item._id, "Like")?'text-green-600':'text-amber-700'}
                                        hover:-translate-x-2
                                    `}
                                    onClick={() => actionPost(item._id, "Like")}
                                >
                                    <Like/>
                                </button>
                                
                                <button title="Dislike post" 
                                    className={`
                                        text-3xl 
                                        ${inAction(item._id, "Dislike")?'text-red-600':'text-amber-700'}
                                        hover:-translate-x-2
                                    `}
                                    onClick={() => actionPost(item._id, "Dislike")}
                                >
                                    <Dislike/>
                                </button>
                            </div>
                            <button
                                className="flex flex-col bg-amber-200 w-post h-post rounded-lg text-white"
                                onClick={() => history(`post/${item._id}`)}
                            >
                                <div className="flex items-center bg-amber-500 p-4 outline rounded-lg w-full text-left">
                                    <div>
                                        {item.name}
                                    </div>
                                    <div className="flex justify-end gap-2 grow">
                                        {item.category.map((item, index) => (
                                            <div className="bg-amber-700 rounded-md px-2 py-0.5" key={index}>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <textarea disabled className="flex hover:cursor-pointer flex-wrap p-4 text-black w-full h-full overflow-hidden"
                                    value={item.content}
                                />
                            </button>
                        </div>
                    ))
                }
            </div>
            
            <div className="flex flex-col gap-8 fixed right-16 top-24 p-4">
                <button className="bg-amber-700 rounded-lg px-4 py-2 drop-shadow-xl">
                    <div className="hover:-translate-y-0.5 hover:font-bold duration-150 ease-linear text-white">
                        MY POSTS
                    </div>
                </button>
                <button className="bg-amber-700 rounded-lg px-4 py-2 drop-shadow-xl"
                    onClick={addPost}
                >
                    <div className="hover:-translate-y-0.5 hover:font-bold duration-150 ease-linear text-white">
                        ADD POST
                    </div>
                </button>
            </div>
            
        </div>
    )
}

export default DashboardPage