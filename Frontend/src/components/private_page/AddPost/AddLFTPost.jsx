import React, { useState } from 'react'
import { Dialog, Listbox } from '@headlessui/react'
import { 
    MdExpandMore as Down,
    MdCancel as Cancel,
    MdGroup as Group,
} from 'react-icons/md'

import TransitionDialog from '../../../utils/TransitionDialog'

import { postCategory, teamCategory } from './category'
import { useOutletContext } from 'react-router-dom'
import PostService from '../../../services/postService'

const AddLFTPost = ({
    open,
    setOpen
}) => {
    const { user } = useOutletContext();

    const [post, setPost] = useState({
        name: "",
        desc: "",
        tagQuestion: false,
        exp: "",
        teamCat: [],
    })

    const [category, setCategory] = useState([])
    const [err, setErr] = useState("")

    const handlePost = (e) => {
        setPost(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const validatePost = () => {
        if(!post.desc) {
            setErr("Description cannot be empty")
            return false
        }
        if(!post.exp) {
            setErr("Experience cannot be empty")
            return false
        }
        return true
    }

    const createPost = async() => {
        if(!validatePost()) return
        try {
            const postToSubmit = {
                name: `I am looking for ${post.teamCat.map(item => teamCategory.find(o => o.value === item).placeholder).join(", ")} team for ${category.join(", ")}`,
                content: 
                `${post.desc}\nHere's my experience:\n${post.exp}`,
                category: category,
                like: 0,
                dislike: 0,
                tag: "LFT",
                image: null,
                createdBy: user._id
            }

            await PostService.createPost(postToSubmit)
            
            window.location.reload()
            handleClose()
        }
        catch(err) {
            console.log(err)
            alert(err?.response?.data?.error)
        }
    }

    const navigateToAddNormalPost = () => {
        setOpen("normal")
    }

    const handleClose = () => {
        setOpen("")
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
                <Group/>
                Finding a team
                <div className="flex grow justify-end">
                    <button className="hover:opacity-50"
                        onClick={handleClose}
                    >
                        <Cancel/>
                    </button>
                </div>
            </Dialog.Title>

            <div className="mt-4">
                <Listbox value={category} onChange={setCategory} multiple>
                    <Listbox.Button className="
                        inline-flex justify-left items-center 
                        rounded-md border px-4 py-2 w-full
                        text-md hover:bg-slate-200
                    "
                    >
                        What projects are you into?
                        <Down className="ml-2 -mr-1 h-5 w-5"/>
                    </Listbox.Button>
                    <Listbox.Options className="
                        flex flex-col max-h-44 overflow-auto
                        mt-1 bg-white rounded-lg p-2 border gap-2 w-full
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

            <div className="mt-2 flex">
                {
                    category.map((item,index) => (
                        <div key={item} 
                            className={`
                                ${index==0 && "rounded-l-lg"}
                                ${index==category.length-1 && "rounded-r-lg"}
                                p-2 border
                                flex items-center gap-2
                            `}
                        >
                            {item}
                            <button
                                className='hover:text-red-500'
                                onClick={()=>setCategory(prev => prev.filter(obj => obj !== item))}
                            >
                                <Cancel/>
                            </button>
                        </div>
                    ))
                }
            </div>

            <div className="mt-4">
                <Listbox value={post.teamCat} onChange={e => setPost(prev => ({...prev, teamCat: e}))} multiple>
                    <Listbox.Button className="
                        inline-flex justify-left items-center 
                        rounded-md border px-4 py-2 w-full
                        text-md hover:bg-slate-200
                    "
                    >
                        What type of team are you looking for?
                        <Down className="ml-2 -mr-1 h-5 w-5"/>
                    </Listbox.Button>
                    <Listbox.Options className="
                        flex flex-col max-h-44 overflow-auto
                        mt-1 bg-white rounded-lg p-2 border gap-2 w-full
                    ">
                        {
                        teamCategory.map((item, index) => (
                            <Listbox.Option key={index} value={item.value}>
                                {({ selected }) => (
                                    <button className=
                                    {`rounded-lg px-2 py-1 w-full flex
                                    ${selected && 'bg-slate-200'}
                                    `}
                                    >
                                        {item.placeholder}
                                    </button>
                                )}
                            </Listbox.Option>
                        ))
                        }
                    </Listbox.Options>
                </Listbox>
            </div>

            <div className="mt-2 flex">
                {
                    post.teamCat.map((item,index) => (
                        <div key={item.value} 
                            className={`
                                ${index==0 && "rounded-l-lg"}
                                ${index==post.teamCat.length-1 && "rounded-r-lg"}
                                p-2 border
                                flex items-center gap-2
                            `}
                        >
                            {teamCategory.find(o => o.value === item).placeholder}
                            <button
                                className='hover:text-red-500'
                                onClick={()=>setPost(prev => ({...prev, teamCat: prev.teamCat.filter(obj => obj !== item)}))}
                            >
                                <Cancel/>
                            </button>
                        </div>
                    ))
                }
            </div>

            <div className="mt-4 flex gap-2">
                <div className="pt-2">
                    Description:
                </div>
                <textarea
                    rows={6}
                    className="
                        outline-none border rounded-lg
                        p-2 pr-10 w-full resize-none
                    "
                    name="desc"
                    value={post.desc}
                    placeholder="Describe yourself shortly"
                    onChange = {e => handlePost(e)}
                />
            </div>

            <div className="mt-4 flex gap-2">
                <div className="pt-2">
                    Experience:
                </div>
                <textarea
                    rows={6}
                    className="
                        outline-none border rounded-lg
                        p-2 pr-10 w-full resize-none
                    "
                    name="exp"
                    value={post.exp}
                    placeholder="What expertise do you provide?"
                    onChange = {e => handlePost(e)}
                />
            </div>
            
            {
                err && 
                <div className="mt-2 text-red-500">
                    {err}
                </div>
            }
            
            <div className="flex gap-2 mt-4">
                <button
                    type="button"
                    className="
                        bg-transparent text-sm text-amber-600 font-medium
                        rounded-lg px-4 py-2 border border-amber-600
                        hover:bg-amber-600 hover:text-white
                    "
                    onClick={navigateToAddNormalPost}
                >
                    Back
                </button>

                <button
                    type="button"
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

export default AddLFTPost