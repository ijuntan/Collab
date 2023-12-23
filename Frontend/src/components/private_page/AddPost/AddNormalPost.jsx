import React, { useState } from 'react'

import { Dialog, Listbox } from '@headlessui/react'

import { 
    MdExpandMore as Down,
    MdCancel as Cancel,
    MdImage as Image
} from 'react-icons/md'

import ProfilePic from '../../../utils/ProfilePic'
import TransitionDialog from '../../../utils/TransitionDialog'

import { postCategory } from './category'
import { useOutletContext } from 'react-router-dom'
import PostService from '../../../services/postService'

const AddNormalPost = ({
    open,
    setOpen,
    question
}) => {
    const { user } = useOutletContext();

    const [post, setPost] = useState({
        name: "",
        desc: "",
        tagQuestion: question,
    })
    const [imageURL, setImageURL] = useState(null)
    const [category, setCategory] = useState([])

    const openLFTButton = () => {
        setOpen("LFT")
    }

    const openLFMButton = () => {
        setOpen("LFM")
    }
    
    const handlePost = (e) => {
        setPost(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleClose = () => {
        setOpen("")
    }

    const createPost = async() => {
        try {
            const postToSubmit = {
                name: post.name,
                content: post.desc,
                category: category,
                like: 0,
                dislike: 0,
                tag: post.tagQuestion ? "question":"normal",
                image: '',
                createdBy: user._id
            }
            const post_id = await PostService.createPost(postToSubmit)
            
            if(post_id.status === 200 && imageURL) {
                const formData = new FormData();
                formData.append('image', imageURL);
                await PostService.uploadImage(formData, post_id.data)
            }
            window.location.reload()
            handleClose()
        }
        catch(err) {
            console.log(err)
            alert(err?.response?.data?.error)
        }
    }

    return (
        <TransitionDialog open={Boolean(open)} handleClose={handleClose}>
            <Dialog.Title
                as="h3"
                className="
                    flex items-center gap-2
                    text-2xl font-medium leading-6 text-gray-900
                "
            >
                <ProfilePic src="self"/>
                {user.username}
                <div className="flex grow justify-end">
                    <button className="hover:opacity-50"
                        onClick={() => setOpen(false)}
                    >
                        <Cancel/>
                    </button>
                </div>
            </Dialog.Title>
            
            <div className="mt-2 border-b">
                <input
                    className="
                        outline-none
                        p-2 w-full
                        placeholder-black
                    "
                    name="name"
                    value={post.name}
                    placeholder="Title"
                    onChange = {e => handlePost(e)}
                />
            </div>

            <div className="mt-2">
                <Listbox value={category} onChange={setCategory} multiple>
                    <Listbox.Button className="
                        inline-flex justify-center items-center 
                        rounded-md border px-4 py-2 
                        text-sm hover:bg-slate-200
                    "
                    >
                        {
                            category.length < 1
                            ?
                            <>
                            Choose Category
                            <Down className="ml-2 -mr-1 h-5 w-5"/>
                            </> 
                            :
                            <div>
                            {category.join(" | ")}
                            </div>
                        }
                        
                    </Listbox.Button>
                    <Listbox.Options className="
                        absolute flex flex-col max-h-44 overflow-auto
                        mt-2 bg-white rounded-lg p-2 border gap-2
                    ">
                        {
                        postCategory.map((item, index) => (
                            <Listbox.Option key={index} value={item}>
                                {({ selected }) => (
                                    <button className=
                                    {`rounded-lg px-2 py-1 w-full flex
                                    ${selected && 'bg-slate-200'}
                                    `}
                                    >
                                        {item}
                                    </button>
                                )}
                            </Listbox.Option>
                        ))
                        }
                    </Listbox.Options>
                </Listbox>
            </div>

            <div className="mt-2">
                <textarea
                    rows={15}
                    className="
                        outline-none border rounded-lg
                        p-2 pr-10 w-full resize-none
                        placeholder-black
                    "
                    name="desc"
                    value={post.desc}
                    placeholder="Description"
                    onChange = {e => handlePost(e)}
                />
            </div>

            <div className="mt-2">
                {
                    imageURL &&
                    <img
                        src={URL.createObjectURL(imageURL)}
                    />
                }
                
                <button className={`
                    ${!imageURL && "hidden"}
                    bg-red-300 text-sm text-red-800
                    rounded-lg px-4 py-2 mt-2 ${post.tagQuestion && 'font-bold underline'}
                    hover:bg-red-400 hover:shadow-3
                `}
                    onClick={()=>setImageURL(null)}
                >
                    Delete Image
                </button>
            </div>

            <div className="flex gap-2 mt-2">
                <button className={`
                    bg-cream-300 text-sm text-amber-800
                    rounded-lg px-4 py-2 ${post.tagQuestion && 'font-bold underline'}
                    hover:bg-cream-400 hover:shadow-3
                `}
                onClick={()=>setPost(prev => ({...prev, tagQuestion: !prev.tagQuestion}))}
                >
                    Tag as Question
                </button>

                <button className="
                    bg-cream-300 text-sm text-amber-800
                    rounded-lg px-4 py-2 
                    hover:bg-cream-400 hover:shadow-3
                "
                onClick={openLFTButton}
                >
                    Looking for Team
                </button>

                <button className="
                    bg-cream-300 text-sm text-amber-800
                    rounded-lg px-4 py-2 
                    hover:bg-cream-400 hover:shadow-3
                "
                onClick={openLFMButton}
                >
                    Looking for Members
                </button>

                <div className="flex grow justify-end">
                    <label 
                        htmlFor="image-input" 
                        className="text-amber-700 text-2xl cursor-pointer" 
                        title="Upload an Image"
                    >
                        <Image/>
                    </label>
                    <input
                        className='hidden'
                        id="image-input"
                        type="file"
                        accept="image/*"
                        onChange= {e => {
                            const file = e.target.files[0]
                            setImageURL(new Blob([file], { type: file.type }))
                        }}
                    />
                </div>
            </div>

            <div className="mt-4">
                <button
                    className="
                        bg-amber-600 text-sm text-white font-medium
                        rounded-lg px-4 py-2 border border-amber-600
                        hover:bg-amber-700 hover:border-amber-700
                    "
                    onClick={createPost}
                >
                Post
                </button>
            </div>
        </TransitionDialog>
    )
}

export default AddNormalPost