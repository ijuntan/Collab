import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'
import { useOutletContext, useNavigate, useParams } from 'react-router-dom'
import PostService from '../../services/postService'
import CommentService from '../../services/commentService'
import { 
    MdOutlineLocalFireDepartment as Fire,
    MdOutlineTimelapse as Time,
    MdThumbUpOffAlt as Like,
    MdThumbDownOffAlt as Dislike,
    MdKeyboardArrowLeft as Left,
    MdReply as Reply,
    MdDelete,
    MdEdit,
    MdArrowRight,
}
from 'react-icons/md'
import DateFormat from '../../utils/DateFormat'
import ProfilePic from '../../utils/ProfilePic'
import Loading from '../../utils/Loading'
const EditPost = lazy(() => import('./EditPage/EditPost'))

const sortCat = [
    "Hot",
    "Newest",
]

const CommentReply = ({user, parentId, comment, ReplyButton, inAction, doAction, deleteComment}) => {
    const parentComment = comment.filter(item => item.parent === parentId)
    return(
        <div className='flex flex-col gap-2'>
        {
            parentComment.map(parent => (
                <div
                    key={parent._id}
                    className="
                        flex flex-col bg-white p-2 rounded-lg gap-2 
                        border
                    "
                >
                    <div  
                        className="
                        flex items-center bg-white rounded-lg gap-2
                        "
                    >
                        <ProfilePic src={parent.createdBy.profilePic}/>
                        
                        <div className="flex flex-col">
                            <div>{parent.createdBy.username}</div>
                            <DateFormat date={parent.createdAt} color="text-gray-700"/>
                        </div>
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

                    <div className="flex items-center gap-2 border-t-1">
                            <button className={`
                                text-xl p-2 rounded-lg hover:bg-slate-300
                                ${inAction(parent._id, "Like")?'text-green-600':'text-black'}
                            `}
                            onClick={() => doAction(parent._id, "Comment", "Like")}
                            >
                                <Like/>
                            </button>

                            <div>
                                {parent?.like || 0}
                            </div>

                            <button className={`
                                text-xl p-2 rounded-lg hover:bg-slate-300
                                ${inAction(parent._id, "Dislike")?'text-red-600':'text-black'}
                            `}
                            onClick={() => doAction(parent._id, "Comment", "Dislike")}
                            >
                                <Dislike/>
                            </button>

                            <div>
                                {parent?.dislike || 0}
                            </div>

                            <ReplyButton parentComment={parent}/>
                    </div>

                    <CommentReply 
                    comment={comment.filter(item => item.root === parent.root)} 
                    parentId={parent._id} 
                    ReplyButton={ReplyButton} 
                    inAction={inAction}
                    user={user} 
                    doAction={doAction}
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

    const [showEditPost, setShowEditPost] = useState(false)

    const { id } = useParams()

    const navigate = useNavigate()
    
    const updateActionLocally = (targetId, to, act, beforeAct) => {
        if(!action?.some(e => e.to === targetId)) {
            const newActionState = [...action, {accountID: user._id, to: targetId, actionTo:"Post", action: act}]
            setAction(newActionState)
        }
        else {
            const newActionState = action.map(obj =>
                obj.to === targetId
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

        if(to === "Post") {
            const newPostState = {...post, like: post.like + linc, dislike: post.dislike + dinc}

            setPost(newPostState)
        }
        else {
            const newCommentState = comment.map(obj =>
                obj._id === targetId
                ? {...obj, like: obj.like + linc, dislike: obj.dislike + dinc}
                : obj
            )
            setComment(newCommentState)
        }
        
    }

    const doAction = async(targetId, to, actionType) => {
        try {
            if(!action.some(e => e.to === targetId)) {
                const actionToSubmit = {
                    accountID: user._id,
                    to: targetId,
                    actionTo: to,
                    action: actionType
                }

                if(to === "Post") {
                    await PostService.actionToPost(actionToSubmit)
                }
                else {
                    await CommentService.updateActionComment({
                        userID: user._id, 
                        commentID: targetId, 
                        act: actionType,
                        beforeAct: ""
                    })
                }
                
                updateActionLocally(targetId, to, actionType, "")
            }
            else {
                const act = action.find(e => e.to === targetId)
                const actionTypeToSubmit = (act.action === "None" || act.action !== actionType) ? actionType : "None";

                if(to === "Post") {
                    await PostService.updateActionPost({
                        userID: user._id, 
                        postID: targetId, 
                        act: actionTypeToSubmit, 
                        beforeAct: act.action
                    })
                }
                else {
                    await CommentService.updateActionComment({
                        userID: user._id, 
                        commentID: targetId, 
                        act: actionTypeToSubmit, 
                        beforeAct: act.action
                    })
                }

                updateActionLocally(targetId, to, actionTypeToSubmit, act.action)
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
            const promise = await PostService.getPostById(id)
            setPost(promise.data)
        } catch(err) {
            console.log(err.data.response.error)
        }
    }

    const fetchComment = async() => {
        try {
            const promise = await CommentService.getComment(id)
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
            if(success) navigate('/dash')
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

    const ReplyButton = ({parentComment}) => {
        const [showForm, setShowForm] = useState(false)
        const [commentContent, setCommentContent] = useState("")
        return(
            <>
            <button className="
                flex items-center gap-1 text-xl text-gray-800 p-2 rounded-lg hover:bg-slate-300 peer
            "
                onClick={() => setShowForm(prev => !prev)}
            >
                <Reply/>
                <div className='text-sm'>
                    Reply
                </div>
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
                <button className='text-2xl p-2 hover:bg-slate-300 rounded-lg'
                    onClick={()=>saveCommentToComment(parentComment, commentContent, setCommentContent, setShowForm)}
                >
                    <MdArrowRight/>
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

    const handleComment = (comment) => {
        const parentComments = comment?.filter(item => item.parent === null)

        if(sort === sortCat[0]) {
            return parentComments.sort((a, b) => (b.like - b.dislike) - (a.like - a.dislike))
        }
        else if(sort === sortCat[1]) {
            return parentComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }

        return parentComments
    }
    const parentComment = useMemo(()=> comment && handleComment(comment), [comment, sort])

    if( post === null || comment === null) return (<Loading/>)
    return (
        <>
        <div className="grow"/>
        <div className="flex flex-col gap-4 w-70vw max-w-3xl py-5% h-full">
            <div className="flex justify-start">
                <button className="flex gap-1 items-center" onClick={() => navigate(-1)}>
                    <Left/>
                    BACK
                </button>
            </div>
            
            <div className='
                flex flex-col gap-4
                rounded-lg bg-amber-700 
                p-4 border
                text-white font-bold' 
            >
                <div className="
                    flex gap-2 items-center
                ">
                    <ProfilePic src={post?.createdBy?.profilePic}/>
                        
                    <div className="flex flex-col">
                        <div>{post?.createdBy.username}</div>
                        <DateFormat date={post?.createdAt}/>
                    </div>
                    {
                        post?.createdBy._id === user._id &&
                        <div className='flex grow gap-2 justify-end'>
                            <button 
                                onClick={() => setShowEditPost(true)}
                            >
                                <MdEdit className='hover:text-gray-400 text-xl'/>
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
                    flex flex-col gap-2
                ">
                    <div className='flex items-center gap-2'>
                        {
                            post?.tag !== "normal" && 
                            {
                                "question":
                                <div className={`flex items-center bg-white px-2 rounded-full text-red-700`}>
                                    Question
                                </div>,
                                "LFT":
                                <div className={`flex items-center bg-white px-2 rounded-full text-gray-600`}>
                                    Looking for team
                                </div>,
                                "LFM":
                                <div className={`flex items-center bg-white px-2 rounded-full text-gray-600`}>
                                    Looking for members
                                </div>,
                            }[post?.tag]
                        }
                        <div
                            className="
                                max-w-sm truncate
                                font-medium text-xl
                            "
                        >
                            {post?.name}
                        </div>
                    </div>
                </div>
            </div>
                    
            {
                post?.category.length !== 0 &&
                <div className='flex items-center font-medium gap-2'>
                    <div>
                        Category:
                    </div>
                    {
                    post?.category.map(cat => (
                        <div key={cat} className="
                            text-black bg-white border px-2 py-1
                            rounded-full
                        ">
                            {cat}
                        </div>
                    ))
                    }
                </div>
            }


            <div className='flex flex-col gap-4 rounded-lg bg-white rounded p-4 border'>
                <div className='text-slate-600 whitespace-pre-line'>
                    {post?.content}
                </div>

                <img src={post?.image} className='object-none'/>

                <div className='flex items-center gap-2'>
                    <button className={`
                        text-xl p-2 rounded-lg hover:bg-gray-200
                        ${inAction(post?._id, "Like")?'text-green-600':'text-black'}
                    `}
                    onClick={() => doAction(post?._id, "Post", "Like")}
                    
                    >
                        <Like/>
                    </button>
                    <div>
                        {post?.like}
                    </div>
                    <button className={`
                        text-xl p-2 rounded-lg hover:bg-gray-200
                        ${inAction(post?._id, "Dislike")?'text-red-600':'text-black'}
                    `}
                    onClick={() => doAction(post?._id, "Post", "Dislike")}
                    >
                        <Dislike/>
                    </button>
                    <div>
                        {post?.dislike}
                    </div>
                </div>
            </div>
            
            {/* Add Comment */}
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
            
            <div className="flex flex-col border rounded-lg">
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
            
            {/* Comment List */}
            <div className="flex flex-col gap-4">
                <div className="border border-1 border-slate-700"/>
                {
                    parentComment?.map(parent => (
                        <div
                            key={parent._id}
                            className="
                                flex flex-col bg-white p-2 rounded-lg gap-2 
                                border border-slate-400
                            "
                        >
                            <div  
                                className="
                                flex items-center bg-white rounded-lg gap-2
                                "
                            >
                                <ProfilePic src={parent?.createdBy?.profilePic}/>

                                <div className="flex flex-col">
                                    <div>{parent.createdBy.username}</div>
                                    <DateFormat date={parent.createdAt} color="text-gray-700"/>
                                </div>

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
                            
                            <div className="flex gap-2 border-t-1 items-center">
                                    <button className={`
                                        text-xl p-2 rounded-lg hover:bg-slate-300
                                        ${inAction(parent._id, "Like")?'text-green-600':'text-black'}
                                    `}
                                    onClick={() => doAction(parent._id, "Comment", "Like")}
                                    
                                    >
                                        <Like/>
                                    </button>

                                    <div>
                                        {parent?.like || 0}
                                    </div>

                                    <button className={`
                                        text-xl p-2 rounded-lg hover:bg-slate-300
                                        ${inAction(parent._id, "Dislike")?'text-red-600':'text-black'}
                                    `}
                                    onClick={() => doAction(parent._id, "Comment", "Dislike")}
                                    >
                                        <Dislike/>
                                    </button>

                                    <div>
                                        {parent?.dislike || 0}
                                    </div>

                                    <ReplyButton parentComment={parent}/>
                            </div>

                            <CommentReply 
                                user={user}
                                parentId={parent._id}  

                                comment={comment.filter(item => item.root === parent._id)} 

                                ReplyButton={ReplyButton}

                                inAction={inAction} 
                                doAction={doAction}
                                deleteComment={deleteComment}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
        <div className="grow"/>

        {
            showEditPost &&
            <Suspense fallback={<Loading/>}>
                <EditPost
                    open={showEditPost} 
                    handleClose={() => setShowEditPost(false)}
                    inputPost={post}
                />
            </Suspense>
        }
        </>
    )
}

export default PostScreen