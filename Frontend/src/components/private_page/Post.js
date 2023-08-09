import React, { useContext, useEffect, useState } from 'react'
import PostService from '../../services/postService'
import { UserContext } from '../../services/authComponent'
import { useNavigate } from 'react-router-dom'
import { MdAccountCircle } from 'react-icons/md'

const Post = () => {
    const {user} = useContext(UserContext)
    console.log(user)
    const history = useNavigate()

    const [posts, setPosts] = useState(null)

    const fetchPost = async() => {
        const promise = await PostService.getPostByUser(user._id)
        setPosts(promise.data)
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

    useEffect(() => {
        fetchPost()
    }, [])

    return (
        <>
        <div className="grow"/>
        <div className="flex grow">
            {console.log(posts)}
            {
                posts?.length>0 ?
                <div className='flex flex-col w-full p-6 gap-6'>
                    <div className='text-2xl font-bold'>
                        Posts
                    </div>
                    {
                    posts.map(item => (
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
                                py-2 px-4 rounded-t-lg
                                text-white
                            "
                            >
                                <div className="
                                    flex gap-2
                                ">
                                    <button className="
                                    flex gap-2 items-center
                                    "
                                        onClick={() => history(`/dash/post/${item._id}`)}
                                    >
                                        {item.name}
                                        {dateDiff(item.createdAt)}
                                    </button>

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
                            </div>
                            
                            {/* Content */}
                            <div
                            className="
                                bg-white max-h-36 overflow-hidden
                                px-4 py-2 whitespace-pre
                                text-slate-800 rounded-b-lg
                            ">
                                {item.content}
                            </div>
                        </div>
                    ))
                    }
                </div>
                :
                <div className='flex text-center justify-center items-start pt-12 font-bold text-3xl w-full gap-2'>
                    You have not created a post, 
                    <button
                        className='hover:text-amber-800'
                        onClick={()=>history("/dash")}
                    >
                        go back and create a post first
                    </button>
                </div>
            }
        </div>
        <div className="grow"/>

        </>
    )
}

export default Post