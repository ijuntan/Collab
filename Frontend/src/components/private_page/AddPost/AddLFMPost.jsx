import React, { useEffect, useState } from 'react'
import { Dialog, Listbox } from '@headlessui/react'
import { 
    MdExpandMore as Down,
    MdCancel as Cancel,
    MdEmojiPeople as FindPeople,
} from 'react-icons/md'

import TransitionDialog from '../../../utils/TransitionDialog'

import { postCategory, personCategory } from './category'
import { useOutletContext } from 'react-router-dom'
import PostService from '../../../services/postService'
import ProjectService from '../../../services/projectService'

const AddLFMPost = ({
    open,
    setOpen
}) => {
    const { user } = useOutletContext();

    const [post, setPost] = useState({
        name: "",
        desc: "",
        tagQuestion: false,
        project: "",
        personCat: [],
    })

    const [imageURL, setImageURL] = useState(null)
    const [category, setCategory] = useState([])

    const [userProject, setUserProject] = useState(null)

    const handlePost = (e) => {
        setPost(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const createPost = async() => {
        try {
            const postToSubmit = {
                name: 
                `Searching members for ${userProject.find(item => item._id === post.project).name} project`,
                content:
                `We need the following people:\n${post.personCat.join(`\n`)}\n\n${post.desc}`,
                category: userProject.find(item => item._id === post.project).category,
                like: 0,
                dislike: 0,
                tag: "LFM",
                image: null,
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

    const navigateToAddNormalPost = () => {
        setOpen("normal")
    }

    const handleClose = () => {
        setOpen("")
    }

    useEffect(() => {
        const fetchProject = async() => {
            try {
                const promise = await ProjectService.getProjects(user._id)
                setUserProject(promise.data)
            }
            catch(err) {
                alert(err?.response?.data?.error)
            }
        }

        fetchProject()
    }, [])

    return (
        <TransitionDialog open={Boolean(open)} handleClose={handleClose}>
            <Dialog.Title
                as="h3"
                className="
                    flex items-center gap-2
                    text-2xl font-medium leading-6 text-gray-900
                "
            >
                <FindPeople/>
                Finding members
                <div className="flex grow justify-end">
                    <button className="hover:opacity-50"
                        onClick={handleClose}
                    >
                        <Cancel/>
                    </button>
                </div>
            </Dialog.Title>

            <div className="mt-4">
                <Listbox value={post.project} onChange={e => setPost(prev => ({...prev, project: e}))}>
                    <Listbox.Button className="
                        inline-flex justify-left items-center 
                        rounded-md border px-4 py-2 w-full
                        text-md hover:bg-slate-200
                    "
                    >
                        Which project do you want to find members for? 
                        <Down className="ml-2 -mr-1 h-5 w-5"/>
                    </Listbox.Button>
                    <Listbox.Options className="
                        flex flex-col max-h-44 overflow-auto
                        mt-1 bg-white rounded-lg p-2 border gap-2 w-full
                    ">
                        { userProject &&
                        userProject.map((item, index) => (
                            <Listbox.Option key={item._id} value={item._id}>
                                {({ selected }) => (
                                    <button className=
                                    {`rounded-lg px-2 py-1 w-full flex
                                    ${selected && 'bg-slate-200'}
                                    `}
                                    >
                                        {item.name}
                                    </button>
                                )}
                            </Listbox.Option>
                        ))
                        }
                    </Listbox.Options>
                </Listbox>
            </div>

            <div className={`${post.project === "" && "hidden"} mt-2 flex gap-2`}>
                <div className="border border-amber-700 rounded-lg p-2">
                    Project name: {post.project && userProject.find(item => item._id === post.project).name}
                </div>
                <button
                    className='hover:text-red-500'
                    onClick={()=>setPost(prev => ({...prev, project:""}))}
                >
                    <Cancel/>
                </button>
            </div>

            <div className="mt-4">
                <Listbox value={post.personCat} onChange={e => setPost(prev => ({...prev, personCat: e}))} multiple>
                    <Listbox.Button className="
                        inline-flex justify-left items-center 
                        rounded-md border px-4 py-2 w-full
                        text-md hover:bg-slate-200
                    "
                    >
                        What do you need help with?
                        <Down className="ml-2 -mr-1 h-5 w-5"/>
                    </Listbox.Button>
                    <Listbox.Options className="
                        flex flex-col max-h-44 overflow-auto
                        mt-1 bg-white rounded-lg p-2 border gap-2 w-full
                    ">
                        {
                        personCategory.map((item, index) => (
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
                    post.personCat.map((item,index) => (
                        <div key={item.value} 
                            className={`
                                ${index==0 && "rounded-l-lg"}
                                ${index==post.personCat.length-1 && "rounded-r-lg"}
                                p-2 border
                                flex items-center gap-2
                            `}
                        >
                            {personCategory.find(o => o.value === item).placeholder}
                            <button
                                className='hover:text-red-500'
                                onClick={()=>setPost(prev => ({...prev, personCat: prev.personCat.filter(obj => obj !== item)}))}
                            >
                                <Cancel/>
                            </button>
                        </div>
                    ))
                }
            </div>

            <div className="mt-4 flex gap-2">
                <div className="pt-2">
                    Requirements:
                </div>
                <textarea
                    rows={6}
                    className="
                        outline-none border rounded-lg
                        p-2 pr-10 w-full resize-none
                    "
                    name="desc"
                    value={post.desc}
                    placeholder={`Describe your requirements shortly\nor\nDescribe the person you are searching for
                    `}
                    onChange = {e => handlePost(e)}
                />
            </div>

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

export default AddLFMPost