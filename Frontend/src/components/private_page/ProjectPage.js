import React, { Fragment, useEffect, useState } from 'react'
import Loading from './Loading'

import { MdAccountCircle, MdAddCircle, MdClose, MdDelete, MdDragIndicator, MdOutlinePerson, MdPersonAdd } from 'react-icons/md'
import { SiDiscord, SiFacebook, SiGithub, SiGitlab, SiLinkedin, SiSlack, SiTwitter } from 'react-icons/si'

import { Dialog, Transition } from '@headlessui/react'

import { useLocation } from 'react-router-dom'
import ProjectService from '../../services/projectService'

const webType = [
    {
        name:"Github",
        web:<SiGithub/>
    },
    {
        name:"Gitlab",
        web:<SiGitlab/>
    },
    {
        name:"Discord",
        web:<SiDiscord/>
    },
    {
        name:"Slack",
        web:<SiSlack/>
    },
    {
        name:"Facebook",
        web:<SiFacebook/>
    },
    {
        name:"Twitter",
        web:<SiTwitter/>
    },
    {
        name:"LinkedIn",
        web:<SiLinkedin/>
    },
]

const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+$/;
const gitlabRegex = /^(https?:\/\/)?(www\.)?gitlab\.com\/[A-Za-z0-9_.-]+$/;
const linkedRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/[A-Za-z0-9_.-]+$/;
const discordRegex = /^(https?:\/\/)?(www\.)?discord\.com\/[A-Za-z0-9_.-]+$/;
const slackRegex = /^(https?:\/\/)?(www\.)?slack\.com\/[A-Za-z0-9_.-]+$/;
const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9_.-]+$/;
const twitterRegex = /^(https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9_.-]+$/;

const AddSocialComponent = ({
    open,
    setOpen,
    save,
    definedWebType
}) => {
    const [linkName, setLinkName] = useState("")
    const [web, setWeb] = useState(null)
    
    const handleClose = () => {
        setOpen(false)
        setLinkName("")
        setWeb(null)
    }

    const handleSave = () => {
        if(linkName !== "" && web) {
            const link = {
                name: linkName,
                web: web
            }
            if(save(link)) handleClose()
        }
    }

    return(
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                                <MdDragIndicator/>

                                <div>
                                    Create a social link
                                </div>
                            </Dialog.Title>
                            
                            <div className="flex gap-2 mt-2">
                            {
                                web ?
                                <div className='flex items-center gap-2 text-2xl p-4'>
                                    {webType.find(item => item.name===web).web}
                                    {web}
                                    <button
                                        onClick={()=>setWeb(null)}
                                    >
                                        <MdClose className='hover:text-red-400'/>
                                    </button>
                                </div>
                                :
                                webType.filter(item => !definedWebType.includes(item.name)).map(item => (
                                    <button className='text-2xl p-4 hover:text-gray-600 hover:rounded-lg border duration-500'
                                        title={item.name}
                                        onClick={()=>setWeb(item.name)}
                                    >
                                        {item.web}
                                    </button>
                                ))
                            }
                            </div>

                            <div className="mt-2">
                                <input
                                    disabled={!web}
                                    className="
                                        outline-none border rounded-lg
                                        p-2 pr-10 w-full resize-none
                                        placeholder-black
                                        disabled:border-red-200
                                    "
                                    value={linkName}
                                    placeholder={web?"https://...":"Please choose a social link"}
                                    onChange = {e => setLinkName(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    className="
                                        bg-amber-600 text-sm text-white font-medium
                                        rounded-lg px-4 py-2 border border-amber-600
                                        hover:bg-amber-700 hover:border-amber-700
                                    "
                                    onClick={handleSave}
                                >
                                Save
                                </button>

                                <button
                                    className="
                                        bg-white text-sm font-medium
                                        rounded-lg px-4 py-2 border border-amber-600
                                        hover:bg-amber-700 hover:border-amber-700 hover:text-white
                                    "
                                    onClick={handleClose}
                                >
                                Cancel
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

const InviteMemberComponent = ({
    open,
    setOpen,
    save,
}) => {
    const [name, setName] = useState("")
    
    const handleClose = () => {
        setOpen(false)
        setName("")
    }

    const handleSave = () => {
        if(name !== "") {
            //if(save(link)) handleClose()
        }
    }

    return(
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
                                <MdOutlinePerson/>

                                <div>
                                    Invite Members
                                </div>
                            </Dialog.Title>
                            

                            <div className="mt-2">
                                <input
                                    className="
                                        outline-none border rounded-lg
                                        p-2 pr-10 w-full resize-none
                                        placeholder-black
                                        disabled:border-red-200
                                    "
                                    value={name}
                                    placeholder={"Enter username"}
                                    onChange = {e => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    className="
                                        bg-amber-600 text-sm text-white font-medium
                                        rounded-lg px-4 py-2 border border-amber-600
                                        hover:bg-amber-700 hover:border-amber-700
                                    "
                                    onClick={handleSave}
                                >
                                Send Invite
                                </button>

                                <button
                                    className="
                                        bg-white text-sm font-medium
                                        rounded-lg px-4 py-2 border border-amber-600
                                        hover:bg-amber-700 hover:border-amber-700 hover:text-white
                                    "
                                    onClick={handleClose}
                                >
                                Cancel
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

const ProjectPage = () => {
    const [project, setProject] = useState(null)
    const [openSocial, setOpenSocial] = useState(false)
    const [openInvite, setOpenInvite] = useState(false)
    const { pathname } = useLocation()

    const saveLink = async(link) => {
        try {
            const promise = await ProjectService.addLinkToProject(project._id, link)
            if(promise) {
                fetchProject()
                return true
            }
        } catch(err) {
            console.log(err)
        }
    }

    const deleteLink = async(linkId) => {
        try {
            const promise = await ProjectService.deleteLinkFromProject(project._id, {linkId})
            if(promise) {
                fetchProject()
            }
        } catch(err) {
            console.log(err)
        }
    }

    const fetchProject = async() => {
        try {
            const promise = await ProjectService.getProject(pathname.split('/')[3])
            setProject(promise.data)
        } catch(err) {
            console.log(err.data.response.error)
        }
    }

    useEffect(() => {
        fetchProject()
    }, [])

    return (
        project
        ?
        <div className='flex w-screen justify-center p-4 gap-4'>

            <div className='flex flex-col w-project gap-6'>
                <div className='flex flex-col rounded-lg bg-amber-600 p-4 drop-shadow-md'>
                    <div className='font-bold text-xl'>
                        {project.name}
                    </div>
                    <div>
                        {new Date(project.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
                    </div>
                </div>

                <div className='flex border whitespace-pre bg-white p-4 drop-shadow-md h-3/5'>
                    {project.content}
                </div>

                <div className='flex flex-col'>
                    <div className='flex z-10 rounded-lg bg-amber-600 p-4 drop-shadow-md'>
                        <div className='grow text-lg font-bold'>
                            Members
                        </div>

                        <button className='hover:text-white duration-500 text-2xl'
                            title="Invite a person"
                            onClick={()=>setOpenInvite(true)}
                        >
                            <MdPersonAdd/>
                        </button>
                    </div>

                    <div className="bg-white p-4 pt-8 drop-shadow-md rounded-b-lg -translate-y-4">
                        {project.members.map(user => (
                            <div className='flex items-center gap-2 drop-shadow-md'>
                                <MdAccountCircle/>
                                {user.username}
                                
                                {
                                    user.username === project.createdBy.username &&
                                    <div className='font-bold'>
                                        Leader
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
                
            </div>

            <div className='flex flex-col rounded-md px-4 text-lg gap-2 items-center'>
                <div className='font-bold text-lg'>
                    Social
                </div>
                
                {
                    project.link.map(item => 
                        <div className='flex gap-2'>
                            <a href={item.name} target="_blank" className='text-3xl hover:text-gray-700'>
                                {webType.find(wb => wb.name===item.web).web}
                            </a>
                            <button
                                onClick={()=>deleteLink(item._id)}
                            >
                                <MdDelete className='hover:text-red-400 text-gray-700'/>
                            </button>
                        </div>
                    )
                }

                <div className='border border-black w-full'/>

                <button className='flex justify-center' title="Add social link"
                    onClick={()=>setOpenSocial(true)}
                >
                    <MdAddCircle/>
                </button>
            </div>

            <AddSocialComponent
                open={openSocial}
                setOpen={setOpenSocial}
                save={saveLink}
                definedWebType={project.link.map(item => item.web)}
            />

            <InviteMemberComponent
                open={openInvite}
                setOpen={setOpenInvite}
            />
            
        </div>
        :
        <div className='border'>
            <Loading/>
        </div>
    )
}

export default ProjectPage