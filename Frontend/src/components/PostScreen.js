import React, { useState, useEffect } from 'react'
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom'
import PostService from '../services/postService'
import { 
    MdOutlineLocalFireDepartment as Fire,
    MdOutlineTimelapse as Time,
    MdThumbUpOffAlt as Like,
    MdThumbDownOffAlt as Dislike,
    MdKeyboardArrowLeft as Left
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
    const [sort, setSort] = useState("")
    const [content, setContent] = useState("")
    const { pathname } = useLocation()
    const history = useNavigate()

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
                setContent(prev => "")
                handlePost()
            }
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        handlePost()
    }, [])

    return (
        <div class="flex flex-col gap-4 w-70vw max-w-3xl py-5% h-full">
            <div class="flex justify-start">
                <button class="flex gap-1 items-center" onClick={() => history(-1)}>
                    <Left/>
                    BACK
                </button>
            </div>
            
            <div class='h-20 rounded-lg bg-amber-700 p-4 font-bold drop-shadow-lg'>
                {post.name} 
                <div class="text-slate-100 font-normal text-sm">
                    created by: {post.createdBy.username}
                </div>
            </div>

            <div class='rounded-lg bg-amber-200 h-addpost p-4 drop-shadow-lg whitespace-pre-line'>
                {post.content}
            </div>

            <div class="flex gap-2 items-center">
                <div class="font-bold mr-4">
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
            
            <div class="flex flex-col drop-shadow-2xl border-black border-2 rounded-t-lg">
                <textarea 
                    class=" h-32 rounded-t-lg p-2 outline-none"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <div class="flex justify-end bg-slate-200">
                    <button class="p-2 text-sm hover:underline"
                        onClick= {saveCommentToPost}
                    >
                        Add Comment
                    </button>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div class="border border-1 border-slate-700"/>

                {
                    post.comment.map((item, index) => (
                        <div class="">
                            {item.createdBy.username}: {item.content}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default PostScreen