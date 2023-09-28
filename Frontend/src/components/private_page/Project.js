import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Dialog, Transition, Menu, Listbox } from '@headlessui/react'
import { UserContext } from '../../services/authComponent'
import ProjectService from '../../services/projectService'
import { MdAccountBalance, MdAdd, MdArrowDropDown, MdCancel, MdDelete, MdLibraryBooks } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const categoryList = [
    "Website",
    "AI",
    "Electronics",
    "Science",
    "Business",
]

const Project = () => {
    const {user} = useContext(UserContext)
    const history = useNavigate()
    const [project, setProject] = useState(null)
    const [category, setCategory] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [projectDialog, setProjectDialog] = useState(
        {
            name: "",
            desc: "",
        }
    )

    const fetchProject = async() => {
        try{
            const res = await ProjectService.getProjects(user._id)
            setProject(res.data)
        } catch(err) {
            console.log(err)
        }
    }

    const handleProjectDialog = (e) => {
        switch(e.target.name) {
            case 'name':
                setProjectDialog(prev => ({...prev, name: e.target.value}))
                break;
            case 'desc':
                setProjectDialog(prev => ({...prev, desc: e.target.value}))
                break;
            default:
                break;
        }
    }

    const createProject = async() => {
        try {
            const projectFinal = {
                name: projectDialog.name,
                content: projectDialog.desc,
                category: category,
                document: [],
                members: {
                    member: user._id,
                    permission: "Admin"
                },
                createdBy: user._id
            }
            const success = await ProjectService.createProject(projectFinal)
            if(success) {
                setOpenDialog(false)
                fetchProject()
            }
        }
        catch(err) {
            console.log(err)
            alert(err?.response?.data?.error)
        }
    }

    const deleteProject = async(id) => {
        try {
            const success = await ProjectService.deleteProject(id)
            if(success) {
                setOpenDialog(false)
                fetchProject()
            }
        }
        catch(err) {
            console.log(err)
            alert(err?.response?.data?.error)
        }
    }

    useEffect(() => {
        fetchProject()
    }, [])
    return (
        <>
        <div className="grow"/>
        <div className="flex grow">
            {
                project?.length>0 ?
                <div className='flex flex-col w-full p-6 gap-6'>
                    <div className='text-2xl font-bold'>
                        Projects
                    </div>
                    {project.map(item => (
                        <div key={item._id}
                            className='border bg-white rounded-lg w-full drop-shadow-md cursor-pointer'
                            onClick={()=>history(`${item._id}`)}
                        >
                            <div className='flex bg-amber-600 rounded-t-lg px-4 py-2 drop-shadow-md'>
                                <p className='font-bold'>
                                    {item.name}
                                </p>
                                <div className='flex grow justify-end'>
                                    <button
                                        onClick={()=>deleteProject(item._id)}
                                    >
                                        <MdDelete className='hover:text-red-400'/>
                                    </button>
                                </div>
                            </div>
                            
                            <p className='px-4 py-2 whitespace-pre border-b'>
                                {`Description:\n${item.content}`}
                            </p>

                            <div className='px-4 py-2 whitespace-pre border-b flex flex-col gap-2'>

                                {`Members:\n`}
                                {
                                    item.members.map(user => (
                                        <p className='flex gap-2 items-center'>
                                            <img className='rounded-full w-10 h-10 bg-gray-200 object-cover' src={user.member.profilePic || "/images/profile.svg"}/>
                                            {`${user.member.username}\n`}
                                        </p>
                                    ))
                                }
                            </div>

                            <p className='px-4 py-2'>
                                Project Created: {new Date(item.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
                            </p>
                        </div>
                    ))}

                    <div className='flex justify-center'>
                        <button className='flex items-center text-md p-2 font-bold border rounded-xl bg-amber-700 text-white hover:text-slate-200'
                            onClick={()=>setOpenDialog(true)}
                        >
                            <MdAdd/>
                            Add Project
                        </button>
                    </div>
                    
                </div>
                :
                <div className='flex text-center justify-center items-start pt-12 font-bold text-3xl w-full gap-2'>
                    You have not created a project,
                    <button
                        className='hover:text-amber-800'
                        onClick={()=>setOpenDialog(true)}
                    >
                        Quick Start a project now
                    </button>
                </div>
            }
        </div>
        <div className="grow"/>

        <Transition appear show={openDialog} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={()=>setOpenDialog(false)}>
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
                                <MdLibraryBooks/>

                                <input
                                    className="
                                        outline-none
                                        p-2 w-full
                                        placeholder-black
                                    "
                                    name="name"
                                    value={projectDialog.name}
                                    placeholder="Title"
                                    onChange = {e => handleProjectDialog(e)}
                                />

                                <div className="flex grow justify-end">
                                    <button className="hover:opacity-50"
                                        onClick={() => setOpenDialog(false)}
                                    >
                                        <MdCancel/>
                                    </button>
                                </div>
                            </Dialog.Title>
                            
                            

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
                                            <MdArrowDropDown className="ml-2 -mr-1 h-5 w-5"/>
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
                                    value={projectDialog.desc}
                                    placeholder="Description"
                                    onChange = {e => handleProjectDialog(e)}
                                />
                            </div>

                            <div className="mt-4">
                                <button
                                    className="
                                        bg-amber-600 text-sm text-white font-medium
                                        rounded-lg px-4 py-2 border border-amber-600
                                        hover:bg-amber-700 hover:border-amber-700
                                    "
                                    onClick={createProject}
                                >
                                Save
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

export default Project