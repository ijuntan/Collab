import React, { useState } from 'react'
import { Menu } from '@headlessui/react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { MdExpandMore as Down } from 'react-icons/md'

import PostService from '../services/postService'

const category = [
    "Website",
    "AI",
    "Electronics",
    "Science",
    "Business"
]

const AddPost = () => {
    const { user } = useOutletContext();

    const [post, setPost] = useState(
        {
            name: "",
            content: "",
            category: []
        }
    )
    
    const history = useNavigate()

    const handlePost = (e) => {
        switch(e.target.name) {
            case 'title':
                setPost(prev => ({...prev, name: e.target.value}))
                break;
            case 'content':
                setPost(prev => ({...prev, content: e.target.value}))
                break;
            default:
                break;
        }
    }

    const handleCategory = (item) => {
        if(!post.category.includes(item))
            setPost(prev => ({...prev, category: [...post.category, item]}))
    }

    const deleteCategory = (item) => {
        setPost(prev => ({...prev, category: post.category.filter(obj => obj != item)}))
    }

    const createPost = async() => {
        const post_final = {
            name: post.name,
            content: post.content,
            category: post.category,
            like: 0,
            createdBy: user._id
        }
        console.log(post_final)
        await PostService.createPost(post_final)
        history('/dash')
    }

    return (
        <div class="flex justify-center items-center h-screen w-screen">
            <div class="flex flex-col gap-4 w-post">

                <div class="flex">
                    <Menu>
                        <Menu.Button class="inline-flex justify-center items-center rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900">
                            Choose Category
                            <Down class="ml-2 -mr-1 h-5 w-5"/>
                        </Menu.Button>
                        <Menu.Items class="absolute flex flex-col mt-2 bg-white rounded-lg p-2 ml-14">
                            {
                                category.map((item, index) => (
                                    <Menu.Item key={index}>
                                        <button class="hover:bg-slate-200 hover:rounded-lg p-2"
                                            onClick={() => handleCategory(item)}
                                        >
                                            {item}
                                        </button>
                                    </Menu.Item>
                                ))
                            }
                        </Menu.Items>
                    </Menu>

                    <div class="flex flex-wrap grow justify-end gap-2">
                        {
                            post.category.map((item, index) => (
                                <div class="flex gap-2 rounded-lg px-2 py-1 bg-amber-800 text-white" key={index}>
                                    {item}
                                    <button class="flex item-center text-red-200"
                                        onClick={() => deleteCategory(item)}
                                    >
                                        x
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
                            
                <div class='h-20 rounded-lg bg-amber-700 p-4'>
                    <input
                        class="
                            bg-transparent outline-none text-white font-bold placeholder-white w-full
                        "
                        name="title"
                        value={post.name}
                        placeholder="Enter Title"
                        onChange = {e => handlePost(e)}
                    />
                </div>

                <div class='rounded-lg bg-amber-200 p-4'>
                    <textarea
                        class="
                            h-addpost bg-transparent outline-none font-bold placeholder-black w-full
                        "
                        name="content"
                        value={post.content}
                        placeholder="Enter Description"
                        onChange = {e => handlePost(e)}
                    />
                </div>

                <div class="flex justify-end gap-2">
                    <button class="text-white rounded-lg bg-amber-700 px-4 py-1 hover:bg-amber-800"
                        onClick={createPost}
                    >
                        Save
                    </button>
                    <button class="text-amber-700 rounded-lg bg-white px-4 py-1 hover:bg-slate-100 border border-amber-700"
                        onClick={(() => history(-1))}
                    >
                        Cancel
                    </button>
                </div>
                
            </div>

        </div>
    )
}

export default AddPost