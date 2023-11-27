import React, { useState } from 'react'
import TransitionDialog from '../../../utils/TransitionDialog'
import PostService from '../../../services/postService'
import { Listbox } from '@headlessui/react'
import { postCategory } from '../AddPost/category'
import { MdExpandMore, MdImage } from 'react-icons/md'

const EditPost = ({
    open,
    handleClose,
    inputPost,
}) => {
    const [post, setPost] = useState({
        name: inputPost.name,
        content: inputPost.content,
    })

    const [category, setCategory] = useState(inputPost.category)
    const [imageURL, setImageURL] = useState(inputPost.image)

    const handlePost = (e) => {
        setPost(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const editPost = async() => {
        try {
            const success = await PostService.updatePost(inputPost._id, {
                name: post.name,
                content: post.content,
                category: post.category,
            })
            if(success.status === 200) {
                if(imageURL !== inputPost.image && imageURL) {
                    const formData = new FormData()
                    formData.append("image", imageURL)
                    const res = await PostService.uploadImage(formData, inputPost._id)
                    if(res.status === 200) handleClose()
            }
            else handleClose()
        }
        }
        catch(err) {
            console.log(err)
        }
    }

    return (
        <TransitionDialog open={open} handleClose={handleClose}>
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="name">Title</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        className="border border-gray-300 rounded-md p-2"
                        value={post.name}
                        onChange={handlePost}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="content">Content</label>
                    <textarea 
                        name="content" 
                        id="content" 
                        cols="30" rows="10" 
                        className="border border-gray-300 rounded-md p-2"
                        value={post.content}
                        onChange={handlePost}
                    />
                </div>
                <div className="flex flex-col items-start mt-2">
                    <label>Category</label>
                    <Listbox value={category} onChange={setCategory} multiple>
                        <Listbox.Button className="
                            inline-flex justify-center items-center 
                            rounded-md border px-4 py-2 mt-2
                            text-sm hover:bg-slate-200
                        "
                        >
                            {
                                category.length < 1
                                ?
                                <>
                                Choose Category
                                <MdExpandMore className="ml-2 -mr-1 h-5 w-5"/>
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
                    {
                        imageURL ?
                        <>
                        <img
                            src={imageURL === inputPost.image ? imageURL : URL.createObjectURL(imageURL)}
                        />
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
                        </>
                        :
                        <>
                            <label 
                                htmlFor="image-input" 
                                className="text-amber-700 text-2xl cursor-pointer" 
                                title="Upload an Image"
                            >
                                <MdImage/>
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
                        </>
                    }
                </div>
                <div className="flex justify-end space-x-4">
                    <button 
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        onClick={editPost}
                    >
                        Save
                    </button>
                </div>
            </div>
        </TransitionDialog>
    )
}

export default EditPost