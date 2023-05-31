import React, { useContext, useState, useEffect } from 'react'
import {useNavigate, useOutletContext} from 'react-router-dom'

import Sidebar from './Sidebar'

import PostService from '../services/postService'

const DashboardPage = () => {
    const { user, filter, searchContent } = useOutletContext();
    const [posts, setPosts] = useState([])
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

    const addPost = async() => {
        history('addpost')
        
    }

    return (
        <div class="flex justify-center w-screen">
            
            <Sidebar/>

            <div class="flex flex-col p-8 gap-8">
                {
                    posts.map((item, index) => (
                        <div class="flex flex-col bg-amber-300 w-post h-post rounded-lg text-white" key={index}>
                            <div class="flex items-center bg-amber-500 p-4 outline rounded-lg">
                                <div class="grow">
                                    {item.name}
                                </div>
                                <div class="bg-amber-700 rounded-md px-2 py-0.5">
                                    {item.category}
                                </div>
                            </div>

                            <div class="p-4 text-black">
                                {item.content}
                            </div>
                        </div>
                    ))
                }
            </div>
            
            <div class="flex flex-col gap-8 fixed right-16 top-24 p-4">
                <button class="bg-amber-700 rounded-lg px-4 py-2 drop-shadow-xl">
                    <div class="hover:-translate-y-0.5 hover:font-bold duration-150 ease-linear text-white">
                        MY POSTS
                    </div>
                </button>
                <button class="bg-amber-700 rounded-lg px-4 py-2 drop-shadow-xl"
                    onClick={addPost}
                >
                    <div class="hover:-translate-y-0.5 hover:font-bold duration-150 ease-linear text-white">
                        ADD POST
                    </div>
                </button>
            </div>
            
        </div>
    )
}

export default DashboardPage