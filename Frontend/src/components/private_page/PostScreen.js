import React, { useState, useEffect } from 'react'
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom'
import PostService from '../../services/postService'
import { 
    MdOutlineLocalFireDepartment as Fire,
    MdOutlineTimelapse as Time,
    MdThumbUpOffAlt as Like,
    MdThumbDownOffAlt as Dislike,
    MdKeyboardArrowLeft as Left,
    MdAccountCircle as Account,
    MdReply as Reply,
}
from 'react-icons/md'

const sortCat = [
    "Hot",
    "Newest",
]

const PostScreen = () => {
    const { user } = useOutletContext()
    const [post, setPost] = useState({
        name: "",
        content: "",
        category: [],
        comment: [],
        like: 0,
        createdBy: ""
    })
    const [action, setAction] = useState([])
    const [sort, setSort] = useState("")
    const [content, setContent] = useState("")
    const { pathname } = useLocation()
    const history = useNavigate()
    
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

        const newPostState = {...post, like: post.like + inc}

        setPost(newPostState)
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

    const handlePost = async() => {
        try {
            const promise = await PostService.getPostById(pathname.split('/')[3])
            setPost(promise.data)
        } catch(err) {
            console.log(err.data.error)
        }
    }

    const saveCommentToPost = async() => {
        try {
            const postcomment = {
                content: content,
                like: 0,
                to: post._id,
                comment: [],
                repliedTo: "Post",
                createdBy: user._id
            }
            const promise = await PostService.createComment(postcomment)
            if(promise) {
                setContent("")
                handlePost()
            }
        } catch(err) {
            console.log(err)
        }
    }

    const saveCommentToComment = async(commentID, commentContent) => {
        try {
            const postcomment = {
                content: commentContent,
                like: 0,
                to: commentID,
                comment: [],
                repliedTo: "Comment",
                createdBy: user._id
            }
            const promise = await PostService.createComment(postcomment)
            if(promise) {
                handlePost()
            }
        } catch(err) {
            console.log(err)
        }
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
            <div className='text-slate-500 text-xs mt-1'>
                {text}
            </div>
        )
    }

    const ReplyButton = ({commentID}) => {
        const [showForm, setShowForm] = useState(false)
        const [commentContent, setCommentContent] = useState("")
        return(
            <>
            <button className="
                text-xl p-2 rounded-lg hover:bg-slate-300 peer
            "
                onClick={() => setShowForm(prev => !prev)}
            >
                <Reply/>
            </button>

            {
                showForm &&
                <>
                <textarea
                    className="
                        outline-none rounded-lg 
                        w-full p-2 pr-10
                        border
                    "
                    value={commentContent}
                    placeholder="Comment.."
                    onChange = {e => setCommentContent(e.target.value)}
                />
                <button className='text-sm p-2 border rounded-lg'
                    onClick={()=>saveCommentToComment(commentID, commentContent)}
                >
                    submit
                </button>
                </>
            }
            </>
        )
    }

    useEffect(() => {
        handlePost()
    }, [])

    useEffect(() => {
        const fetchAction = async(id) => {
            const promise = await PostService.getActionByUser(id)
            setAction(promise.data)
        }

        if(user._id != "") {
            fetchAction(user._id)
        }
    }, [post])

    return (
        <>
        <div className="grow"/>
        <div className="flex flex-col gap-4 w-70vw max-w-3xl py-5% h-full">
            <div className="flex justify-start">
                <button className="flex gap-1 items-center" onClick={() => history(-1)}>
                    <Left/>
                    BACK
                </button>
            </div>
            
            <div className='
                flex flex-col gap-4
                rounded-lg bg-amber-700 
                p-4 drop-shadow-lg
                text-white font-bold' 
            >
                <div className="
                    flex gap-2 items-center
                ">
                    <div className="text-3xl">
                        <Account/>
                    </div>
                    {post.createdBy.username}
                    {dateDiff(post.createdAt)}
                </div>
                
                <div className="
                    flex gap-2
                ">
                    <div
                        className="
                            max-w-sm truncate
                            font-medium text-lg
                        "
                    >
                        {post.post}
                    </div>

                    <div className={
                        `${!(post.tag === "question") && "hidden"}
                            text-cream-200 border border-cream-200 px-2
                            rounded-lg
                        `
                    }
                    >
                        Question
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-4 rounded-lg bg-amber-200 text-slate-800 p-4 drop-shadow-lg whitespace-pre-line'>
                {post.content}

                <div className='flex gap-2'>
                    <button className={`
                        text-xl p-2 rounded-lg hover:bg-cream-500
                        ${inAction(post._id, "Like")?'text-green-600':'text-black'}
                    `}
                    onClick={() => actionPost(post._id, "Like")}
                    
                    >
                        <Like/>
                    </button>

                    <button className={`
                        text-xl p-2 rounded-lg hover:bg-cream-500
                        ${inAction(post._id, "Dislike")?'text-red-600':'text-black'}
                    `}
                    onClick={() => actionPost(post._id, "Dislike")}
                    >
                        <Dislike/>
                    </button>
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <div className="font-bold mr-4">
                    Comments
                </div>

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
            
            <div className="flex flex-col drop-shadow-2xl border-black border-2 rounded-t-lg">
                <textarea 
                    className=" h-32 rounded-t-lg p-2 outline-none"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <div className="flex justify-end bg-slate-200">
                    <button className="p-2 text-sm hover:underline"
                        onClick= {saveCommentToPost}
                    >
                        Add Comment
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="border border-1 border-slate-700"/>

                {
                    post.comment.map((item, index) => (
                        <div
                            key={index}
                            className="
                                flex flex-col bg-white p-2 rounded-lg gap-2 
                                border border-slate-800
                            "
                        >
                            <div  
                                className="
                                flex items-center bg-white rounded-lg gap-2
                                "
                            >
                                <Account/>
                                {item.createdBy.username} 
                                {dateDiff(item.createdAt)}
                            </div>

                            <div>
                                {item.content}
                            </div>

                            <div className="flex gap-2 border-t-1">
                                    <button className={`
                                        text-xl p-2 rounded-lg hover:bg-slate-300
                                        ${inAction(item._id, "Like")?'text-green-600':'text-black'}
                                    `}
                                    onClick={() => actionPost(item._id, "Like")}
                                    
                                    >
                                        <Like/>
                                    </button>

                                    <button className={`
                                        text-xl p-2 rounded-lg hover:bg-slate-300
                                        ${inAction(item._id, "Dislike")?'text-red-600':'text-black'}
                                    `}
                                    onClick={() => actionPost(item._id, "Dislike")}
                                    >
                                        <Dislike/>
                                    </button>

                                    <ReplyButton commentID={item._id}/>
                            </div>

                            {
                            item.comment.map((obj, itndex) => (
                                <div key={itndex} >
                                    <div
                                        className="
                                            flex flex-col bg-white p-2 rounded-lg gap-2 
                                            border border-slate-800
                                        "
                                    >
                                        <div  
                                            className="
                                            flex items-center bg-white rounded-lg gap-2
                                            "
                                        >
                                            <Account/>
                                            {obj.createdBy.username} 
                                            {dateDiff(obj.createdAt)}
                                        </div>

                                        <div className="whitespace-pre-wrap">
                                            {obj.content}
                                        </div>

                                        <div className="flex gap-2 border-t-1">
                                            <button className={`
                                                text-xl p-2 rounded-lg hover:bg-slate-300
                                                ${inAction(obj._id, "Like")?'text-green-600':'text-black'}
                                            `}
                                            onClick={() => actionPost(obj._id, "Like")}
                                            
                                            >
                                                <Like/>
                                            </button>

                                            <button className={`
                                                text-xl p-2 rounded-lg hover:bg-slate-300
                                                ${inAction(obj._id, "Dislike")?'text-red-600':'text-black'}
                                            `}
                                            onClick={() => actionPost(obj._id, "Dislike")}
                                            >
                                                <Dislike/>
                                            </button>

                                            <ReplyButton commentID={obj._id}/>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    ))
                }
            </div>
        </div>
        <div className="grow"/>
        </>
    )
}

export default PostScreen