import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition, Menu, Listbox } from '@headlessui/react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { 
    MdExpandMore as Down,
    MdAccountCircle as Account,
    MdCancel as Cancel,
    MdEmojiPeople as FindPeople,
    MdGroup as Group,
    MdImage as Image
} from 'react-icons/md'
import PostService from '../../services/postService'
import ProjectService from '../../services/projectService'

const personCategoryList = [
    {
        value: "developer",
        placeholder: "Development",
    },
    {
        value: "manager",
        placeholder: "Management",
    },
    {
        value: "marketing",
        placeholder: "Marketing",
    },
    {
        value: "design",
        placeholder: "Design",
    },
    {
        value: "any",
        placeholder: "Any",
    },
]

const teamCategoryList = [
    {
        value: "small",
        placeholder: "Small Team (1-2 members)",
    },
    {
        value: "medium",
        placeholder: "Medium Team (3-8 members)",
    },
    {
        value: "large",
        placeholder: "Large Team (>8 members)",
    },
    {
        value: "any",
        placeholder: "Any",
    },
]

const AddPost = ({
    open,
    setOpen,
    openLFT,
    setOpenLFT,
    openLFM,
    setOpenLFM,
    post,
    setPost,
    categoryList
}) => {
    const { user } = useOutletContext();
    const [imageURL,setImageURL] = useState(null)
    const [postLFT, setPostLFT] = useState(
        {
            desc: "",
            exp: "",
            teamCat: []
        }
    )
    
    const [postLFM, setPostLFM] = useState(
        {
            project: "",
            personCat: [],
            desc: "",
        }
    )

    const [category, setCategory] = useState([])
    const [userProject, setUserProject] = useState(null)

    const history = useNavigate()

    const handlePost = (e) => {
        switch(e.target.name) {
            case 'name':
                setPost(prev => ({...prev, name: e.target.value}))
                break;
            case 'desc':
                setPost(prev => ({...prev, desc: e.target.value}))
                break;
            default:
                break;
        }
    }

    const handlePostLFT = (e) => {
        switch(e.target.name) {
            case 'exp':
                setPostLFT(prev => ({...prev, exp: e.target.value}))
                break;
            case 'desc':
                setPostLFT(prev => ({...prev, desc: e.target.value}))
                break;
            default:
                break;
        }
    }

    const handlePostLFM = (e) => {
        switch(e.target.name) {
            case 'exp':
                setPostLFT(prev => ({...prev, exp: e.target.value}))
                break;
            case 'desc':
                setPostLFT(prev => ({...prev, desc: e.target.value}))
                break;
            default:
                break;
        }
    }

    const createPost = async() => {
        try {
            const post_final = {
                name: post.name,
                content: post.desc,
                category: category,
                like: 0,
                dislike: 0,
                tag: post.tagQuestion ? "question":"normal",
                image: imageURL,
                createdBy: user._id
            }
            const success = await PostService.createPost(post_final)
            if(success) {
                setOpen(false)
                history("/dash")
            }
        }
        catch(err) {
            console.log(err)
            alert(err?.response?.data?.error)
        }
    }

    const createPostLFT = async() => {
        try {
            const post_final = {
                name: 
                `Looking for ${postLFT.teamCat.join(", ")} team`,
                content:
                `${postLFT.desc}\nHere's my experience:\n${postLFT.exp}`,
                category: category,
                like: 0,
                dislike: 0,
                tag: "LFT",
                image: null,
                createdBy: user._id
            }
            const success = await PostService.createPost(post_final)
            if(success) {
                setOpenLFT(false)
                history("/dash")
            }
        }
        catch(err) {
            console.log(err)
            alert(err?.response?.data?.error)
        }
    }

    const createPostLFM = async() => {
        try {
            const post_final = {
                name: 
                `Searching members for ${userProject.find(item => item._id === postLFM.project).name} project`,
                content:
                `We need the following people:\n${postLFM.personCat.join(`\n`)}\n\n${postLFM.desc}}`,
                category: userProject.find(item => item._id === postLFM.project).category,
                like: 0,
                dislike: 0,
                tag: "LFM",
                image: null,
                createdBy: user._id
            }
            console.log(post_final)
            const success = await PostService.createPost(post_final)
            if(success) {
                setOpenLFM(false)
                history("/dash")
            }
        }
        catch(err) {
            console.log(err)
            alert(err?.response?.data?.error)
        }
    }

    const openLFMButton = () => {
        setOpen(false)
        setOpenLFM(true)
    }

    const closeLFMButton = () => {
        setOpen(true)
        setOpenLFM(false)
    }

    const openLFTButton = () => {
        setOpen(false)
        setOpenLFT(true)
    }

    const closeLFTButton = () => {
        setOpen(true)
        setOpenLFT(false)
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
        <>
        {/* Normal and Question Post Dialog */}
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={()=>setOpen(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="
                            w-full max-w-4xl transform overflow-hidden rounded-2xl 
                            bg-white p-6 text-left align-middle shadow-xl transition-all
                        ">
                            <Dialog.Title
                                as="h3"
                                className="
                                    flex items-center gap-2
                                    text-2xl font-medium leading-6 text-gray-900
                                "
                            >
                                <Account/>
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
                                        categoryList.map((item, index) => (
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
                                <img
                                    src={imageURL}
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
                                            setImageURL(URL.createObjectURL(file))
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
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>

        {/* LFT Post Dialog */}
        <Transition appear show={openLFT} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={()=>setOpenLFT(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="
                            w-full max-w-4xl transform overflow-hidden rounded-2xl 
                            bg-white p-6 text-left align-middle shadow-xl transition-all
                        ">
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
                                        onClick={() => setOpenLFT(false)}
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
                                        categoryList.map((item, index) => (
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
                                <Listbox value={postLFT.teamCat} onChange={e => setPostLFT(prev => ({...prev, teamCat: e}))} multiple>
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
                                        teamCategoryList.map((item, index) => (
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
                                    postLFT.teamCat.map((item,index) => (
                                        <div key={item.value} 
                                            className={`
                                                ${index==0 && "rounded-l-lg"}
                                                ${index==postLFT.teamCat.length-1 && "rounded-r-lg"}
                                                p-2 border
                                                flex items-center gap-2
                                            `}
                                        >
                                            {teamCategoryList.find(o => o.value === item).placeholder}
                                            <button
                                                className='hover:text-red-500'
                                                onClick={()=>setPostLFT(prev => ({...prev, teamCat: prev.teamCat.filter(obj => obj !== item)}))}
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
                                    value={postLFT.desc}
                                    placeholder="Describe yourself shortly"
                                    onChange = {e => handlePostLFT(e)}
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
                                    value={postLFT.exp}
                                    placeholder="What expertise do you provide?"
                                    onChange = {e => handlePostLFT(e)}
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
                                    onClick={closeLFTButton}
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
                                    onClick={createPostLFT}
                                >
                                Post
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>

        {/* LFM Post Dialog */}
        <Transition appear show={openLFM} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={()=>setOpenLFM(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="
                            w-full max-w-4xl transform overflow-hidden rounded-2xl 
                            bg-white p-6 text-left align-middle shadow-xl transition-all
                        ">
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
                                        onClick={() => setOpenLFM(false)}
                                    >
                                        <Cancel/>
                                    </button>
                                </div>
                            </Dialog.Title>

                            <div className="mt-4">
                                <Listbox value={postLFM.project} onChange={e => setPostLFM(prev => ({...prev, project: e}))}>
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

                            <div className={`${postLFM.project === "" && "hidden"} mt-2 flex gap-2`}>
                                <div className="border border-amber-700 rounded-lg p-2">
                                    Project name: {postLFM.project && userProject.find(item => item._id === postLFM.project).name}
                                </div>
                                <button
                                    className='hover:text-red-500'
                                    onClick={()=>setPostLFM(prev => ({...prev, project:""}))}
                                >
                                    <Cancel/>
                                </button>
                            </div>

                            <div className="mt-4">
                                <Listbox value={postLFM.personCat} onChange={e => setPostLFM(prev => ({...prev, personCat: e}))} multiple>
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
                                        personCategoryList.map((item, index) => (
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
                                    postLFM.personCat.map((item,index) => (
                                        <div key={item.value} 
                                            className={`
                                                ${index==0 && "rounded-l-lg"}
                                                ${index==postLFM.personCat.length-1 && "rounded-r-lg"}
                                                p-2 border
                                                flex items-center gap-2
                                            `}
                                        >
                                            {personCategoryList.find(o => o.value === item).placeholder}
                                            <button
                                                className='hover:text-red-500'
                                                onClick={()=>setPostLFM(prev => ({...prev, personCat: prev.personCat.filter(obj => obj !== item)}))}
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
                                    value={postLFT.desc}
                                    placeholder={`Describe your requirements shortly\nor\nDescribe the person you are searching for
                                    `}
                                    onChange = {e => handlePostLFM(e)}
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
                                    onClick={closeLFMButton}
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
                                    onClick={createPostLFM}
                                >
                                Post
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
        </>
    )
}

export default AddPost