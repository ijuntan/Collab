import React, { useState, useEffect, useMemo } from 'react'
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom'
import PostService from '../../services/postService'
import CommentService from '../../services/commentService'
import { 
    MdOutlineLocalFireDepartment as Fire,
    MdOutlineTimelapse as Time,
    MdThumbUpOffAlt as Like,
    MdThumbDownOffAlt as Dislike,
    MdKeyboardArrowLeft as Left,
    MdAccountCircle as Account,
    MdReply as Reply,
    MdDelete,
    MdEdit,
}
from 'react-icons/md'

const sortCat = [
    "Hot",
    "Newest",
]

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

const CommentReply = ({comment, parentId, ReplyButton, inAction, user, deleteComment}) => {
    const parentComment = comment.filter(item => item.parent === parentId)
    return(
        <div className='flex flex-col gap-2'>
        {
            parentComment.map(parent => (
                <div
                    key={parent._id}
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
                        <img className='rounded-full w-10 h-10 bg-gray-200 object-cover' src={parent.createdBy.profilePic || "/images/profile.svg"}/>
                        {parent.createdBy.username} 
                        {dateDiff(parent.createdAt)}
                        {
                            parent?.createdBy._id === user._id &&
                            <div className='flex grow justify-end'>
                                <button 
                                    onClick={()=>deleteComment(parent._id)}
                                >
                                    <MdDelete className='hover:text-red-400 text-xl text-black'/>
                                </button>
                            </div>
                        }
                    </div>

                    <div>
                        {parent.content}
                    </div>

                    <div className="flex gap-2 border-t-1">
                            <button className={`
                                text-xl p-2 rounded-lg hover:bg-slate-300
                                ${inAction(parent._id, "Like")?'text-green-600':'text-black'}
                            `}
                            //onClick={() => actionPost(parent._id, "Like")}
                            
                            >
                                <Like/>
                            </button>

                            <button className={`
                                text-xl p-2 rounded-lg hover:bg-slate-300
                                ${inAction(parent._id, "Dislike")?'text-red-600':'text-black'}
                            `}
                            //onClick={() => actionPost(parent._id, "Dislike")}
                            >
                                <Dislike/>
                            </button>

                            <ReplyButton parentComment={parent}/>
                    </div>

                    <CommentReply 
                    comment={comment.filter(item => item.root === parent.root)} 
                    parentId={parent._id} 
                    ReplyButton={ReplyButton} 
                    inAction={inAction}
                    user={user} 
                    deleteComment={deleteComment}
                    />
                </div>
            ))
        }
        </div>
    )
}

const PostScreen = () => {
    const { user } = useOutletContext()
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState(null)
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

        const newPostState = {...post, like: post.like + linc, dislike: post.dislike + dinc}

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

    const fetchPost = async() => {
        try {
            const promise = await PostService.getPostById(pathname.split('/')[3])
            setPost(promise.data)
        } catch(err) {
            console.log(err.data.response.error)
        }
    }

    const fetchComment = async() => {
        try {
            const promise = await CommentService.getComment(pathname.split('/')[3])
            setComment(promise.data)
        } catch(err) {
            console.log(err.data.response.error)
        }
    }

    const saveCommentToPost = async() => {
        try {
            const postcomment = {
                content: content,
                like: 0,
                dislike: 0,
                postId: post._id,
                root:null,
                parent: null,
                createdBy: user._id
            }
            const promise = await CommentService.createComment(postcomment)
            if(promise) {
                setContent("")
                fetchComment()
            }
        } catch(err) {
            console.log(err)
        }
    }

    const saveCommentToComment = async(parentComment, commentContent, setCommentContent, setShowForm) => {
        try {
            const postcomment = {
                content: commentContent,
                like: 0,
                dislike: 0,
                postId: post._id,
                root: parentComment.parent? parentComment.root: parentComment._id,
                parent: parentComment._id,
                createdBy: user._id
            }
            const promise = await CommentService.createComment(postcomment)
            if(promise) {
                setCommentContent("")
                setShowForm(false)
                fetchComment()
            }
        } catch(err) {
            console.log(err)
        }
    }

    const deletePost = async() => {
        try {
            const success = await PostService.deletePost(post._id)
            if(success) history('/dash')
        }
        catch(err) {
            console.log(err)
        }
    }

    const deleteComment = async(id) => {
        try {
            const success = await CommentService.deleteComment(id)
            if(success) fetchComment()
        }
        catch(err) {
            console.log(err)
        }
    }

    const editPost = async() => {
        try {
            // const success = await PostService.updatePost(post._id, )
            // if(success) history('/dash')
        }
        catch(err) {
            console.log(err)
        }
    }

    const ReplyButton = ({parentComment}) => {
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
                    onClick={()=>saveCommentToComment(parentComment, commentContent, setCommentContent, setShowForm)}
                >
                    submit
                </button>
                </>
            }
            </>
        )
    }

    useEffect(() => {
        fetchPost()
        fetchComment()
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

    const parentComment = useMemo(()=> comment?.filter(item => item.parent === null),[comment])

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
                    <img className='rounded-full w-10 h-10 bg-gray-200 object-cover' src={post?.createdBy.profilePic || "/images/profile.svg"}/>
                    {post?.createdBy.username}
                    {dateDiff(post?.createdAt)}
                    
                    {
                        post?.createdBy._id === user._id &&
                        <div className='flex grow gap-2 justify-end'>
                            <button 
                                onClick={editPost}
                            >
                                <MdEdit className='hover:text-green-400 text-xl'/>
                            </button>
                            <button 
                                onClick={deletePost}
                            >
                                <MdDelete className='hover:text-red-400 text-xl'/>
                            </button>
                        </div>
                    }
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
                        {post?.name}
                    </div>
                    <div className={
                        `${!(post?.tag !== "normal") && "hidden"}
                            text-cream-200 border border-cream-200 px-2
                            rounded-lg
                        `
                    }
                    >
                        {post?.tag}
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-4 rounded-lg bg-amber-200 text-slate-800 p-4 drop-shadow-lg whitespace-pre-line'>
                {post?.content}
                
                <img src={post?.image} className='w-100 h-auto'/>

                <div className='flex items-center gap-2'>
                    <button className={`
                        text-xl p-2 rounded-lg hover:bg-cream-500
                        ${inAction(post?._id, "Like")?'text-green-600':'text-black'}
                    `}
                    onClick={() => actionPost(post?._id, "Like")}
                    
                    >
                        <Like/>
                    </button>
                    <div>
                        {post?.like}
                    </div>
                    <button className={`
                        text-xl p-2 rounded-lg hover:bg-cream-500
                        ${inAction(post?._id, "Dislike")?'text-red-600':'text-black'}
                    `}
                    onClick={() => actionPost(post?._id, "Dislike")}
                    >
                        <Dislike/>
                    </button>
                    <div>
                        {post?.dislike}
                    </div>
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
                    parentComment?.map(parent => (
                        <div
                            key={parent._id}
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
                                <img className='rounded-full w-10 h-10 bg-gray-200 object-cover' src={parent.createdBy.profilePic || "/images/profile.svg"}/>
                                {parent.createdBy.username} 
                                {dateDiff(parent.createdAt)}

                                {
                                    parent?.createdBy._id === user._id &&
                                    <div className='flex grow justify-end'>
                                        <button 
                                            onClick={()=>deleteComment(parent._id)}
                                        >
                                            <MdDelete className='hover:text-red-400 text-xl text-black'/>
                                        </button>
                                    </div>
                                }
                            </div>

                            <div>
                                {parent.content}
                            </div>

                            <div className="flex gap-2 border-t-1">
                                    <button className={`
                                        text-xl p-2 rounded-lg hover:bg-slate-300
                                        ${inAction(parent._id, "Like")?'text-green-600':'text-black'}
                                    `}
                                    //onClick={() => actionPost(parent._id, "Like")}
                                    
                                    >
                                        <Like/>
                                    </button>

                                    <button className={`
                                        text-xl p-2 rounded-lg hover:bg-slate-300
                                        ${inAction(parent._id, "Dislike")?'text-red-600':'text-black'}
                                    `}
                                    //onClick={() => actionPost(parent._id, "Dislike")}
                                    >
                                        <Dislike/>
                                    </button>

                                    <ReplyButton parentComment={parent}/>
                            </div>

                            <CommentReply 
                            comment={comment.filter(item => item.root === parent._id)} 
                            parentId={parent._id} 
                            ReplyButton={ReplyButton} 
                            inAction={inAction} 
                            user={user} 
                            deleteComment={deleteComment}
                            />
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