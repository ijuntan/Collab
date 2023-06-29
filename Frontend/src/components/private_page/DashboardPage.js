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
    MdShare as Share
}
from 'react-icons/md'
import Sidebar from './Sidebar'
import PostService from '../../services/postService'
import AddPost from './AddPost'

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
    const [posts, setPosts] = useState([])
    const [action, setAction] = useState([])
    const [sort, setSort] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [openCreatePostDialog, setOpenCreatePostDialog] = useState(false)
    const [openLFT, setOpenLFT] = useState(false)
    const [openLFM, setOpenLFM] = useState(false)

    const history = useNavigate()

    const [post, setPost] = useState(
        {
            name: "",
            desc: "",
            tagQuestion: false
        }
    )

    useEffect(() => {
        const fetchPost = async() => {
            const promise = await PostService.getPost()
            setPosts(promise.data)
        }
    
        const fetchPostByCategory = async() => {
            const promise = await PostService.getPostByCategory(filterCategory)
            setPosts(promise.data)
        }
    
        const fetchPostBySearch = async() => {
            const promise = await PostService.getPostBySearch(searchContent)
            setPosts(promise.data)
        }

        if(searchContent === "") {
            if(filterCategory === "")
                fetchPost()
            else
                fetchPostByCategory()
        }
        else fetchPostBySearch()
        
    }, [ , filterCategory, searchContent])

    useEffect(() => {
        const fetchAction = async(id) => {
            const promise = await PostService.getActionByUser(id)
            setAction(promise.data)
        }
        if(user._id != "") {
            fetchAction(user._id)
        }
    }, [posts])

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

    const dateDiff = (createdAt) => {
        const now = new Date()
        const postDate = new Date(createdAt)
        const diff = Math.floor((now - postDate)/ (1000 * 3600 * 24))
        let text = ""

        if(diff < 1) text="Today"
        else if(diff > 30) text= Math.floor(diff/30) + " Months Ago"
        else text= diff + " Days Ago"

        return(
            <div className='text-slate-200 text-xs mt-1'>
                {text}
            </div>
        )
    }

    return (
        <>
            <div className="grow"/>

            {/* Main Screen */}
            <div className="flex grow py-4 gap-6">
                <div className="flex flex-col grow-[2] gap-4">
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
                                <div className="text-4xl invert">
                                    <Account/>
                                </div>

                                <button className="grow"
                                    onClick={()=> {
                                        setPost(prev => ({...prev, tagQuestion: false}))
                                        setOpenCreatePostDialog(true)
                                    }}
                                >
                                    <input
                                        className="
                                            outline-none rounded-lg border
                                            bg-transparent 
                                            p-2 w-full cursor-text
                                            placeholder-white text-white
                                        "
                                        disabled
                                        placeholder="Create a post"
                                    />
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
                    {
                        posts.map(item => (
                            // Post Card
                            <div
                                key={item.name}
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
                                        <div className="text-3xl">
                                            <Account/>
                                        </div>
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

                                        <div className={
                                            `${!(item.tag === "question") && "hidden"}
                                                text-cream-200 border border-cream-200 px-2
                                                rounded-lg
                                            `
                                        }
                                        >
                                            Question
                                        </div>
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

                                    <button className={`
                                        text-2xl p-2 rounded-lg hover:bg-slate-300
                                        ${inAction(item._id, "Dislike")?'text-red-600':'text-black'}
                                    `}
                                    onClick={() => actionPost(item._id, "Dislike")}
                                    >
                                        <Dislike/>
                                    </button>

                                    <button className={`
                                        text-2xl p-2 rounded-lg hover:bg-slate-300
                                    `}
                                    //onClick={() => actionPost(item._id, "Dislike")}
                                    >
                                        <Share/>
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
                
                {/* Menus */}
                <div className="grow border">
                    <div className="flex justify-center h-40 pt-4 text-white rounded-lg bg-amber-700">
                        Notification
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

            {/* <div className="flex flex-col p-8 gap-8">
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
                                <div className="flex items-center bg-amber-500 p-4 rounded-lg w-full text-left">
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
            </div> */}

            <div className="grow"/>
        </>
    )
}

export default DashboardPage