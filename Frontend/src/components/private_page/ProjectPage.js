import React, { Fragment, useContext, useEffect, useState } from 'react'
import Loading from './Loading'

import { MdAccountCircle, MdAddCircle, MdClose, MdDelete, MdDoorBack, MdDragIndicator, MdEdit, MdOutlinePerson, MdPersonAdd, MdShare } from 'react-icons/md'
import { SiDiscord, SiFacebook, SiGithub, SiGitlab, SiLinkedin, SiSlack, SiTwitter } from 'react-icons/si'

import { Dialog, Popover, Transition } from '@headlessui/react'

import { useParams, useNavigate } from 'react-router-dom'
import ProjectService from '../../services/projectService'
import { GetUser, UserContext } from '../../services/authComponent'
import userService from '../../services/userService'
import TransitionDialog from '../../utils/TransitionDialog'
import ProfilePic from '../../utils/ProfilePic'
import EditProject from './EditPage/EditProject'

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
const regex = {
    github : /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+$/,
    gitlab : /^(https?:\/\/)?(www\.)?gitlab\.com\/[A-Za-z0-9_.-]+$/,
    linkedin : /^(https?:\/\/)?(www\.)?linkedin\.com\/[A-Za-z0-9_.-]+$/,
    discord : /^(https?:\/\/)?(www\.)?discord\.com\/[A-Za-z0-9_.-]+$/,
    slack : /^(https?:\/\/)?(www\.)?slack\.com\/[A-Za-z0-9_.-]+$/,
    facebook : /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9_.-]+$/,
    twitter : /^(https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9_.-]+$/
}

const AddSocialComponent = ({
    open,
    setOpen,
    save,
    definedWebType
}) => {
    const [linkName, setLinkName] = useState("")
    const [web, setWeb] = useState(null)
    const [error, setError] = useState("")

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
            if(regex[web.toLowerCase()].test(linkName)) {
                save(link).then(() => handleClose())
            }
            else{
                setError("Enter a valid link!")
            }
        }
    }

    return(
        <TransitionDialog open={open} handleClose={handleClose}>
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
            
            {error &&
                <div className="mt-2 text-red-500">
                    {error}
                </div>
            }
            

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
        </TransitionDialog>
    )
}

const AddNotesComponent = ({
    open,
    setOpen,
    save,
}) => {
    const [title, setTitle] = useState("")
    
    const handleClose = () => {
        setOpen(false)
        setTitle("")
    }

    const handleSave = () => {
        save(title).then(()=>handleClose())
    }

    return(
        <TransitionDialog open={open} handleClose={handleClose}>
            <Dialog.Title
                as="h3"
                className="
                    flex items-center gap-2
                    text-2xl font-medium leading-6 text-gray-900
                "
            >
                <MdDragIndicator/>

                <div>
                    Create a note
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
                    value={title}
                    onChange = {e => setTitle(e.target.value)}
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
        </TransitionDialog>
    )
}

const InviteMemberComponent = ({
    open,
    setOpen,
    project,
}) => {
    const { user } = useContext(UserContext)
    const [name, setName] = useState("")
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")

    const handleClose = () => {
        setOpen(false)
        setName("")
    }

    const handleSave = async() => {
        if(name === user.username) {
            setError("You can't invite yourself!")
            return
        }
        if(name !== "") {
            try {
                const target = await userService.getUserByName(name)
                if(target.data) {
                    const invitation = {
                        sender: user._id,
                        receiver: target.data._id,
                        projectId: project._id,
                        msg: `${user.username} invited you to join ${project.name} project`,
                        isRead: false
                    }
                    const promise = await userService.sendInvitation(invitation)
                    if(promise.status === 200) {
                        setSuccess("Invitation sent!")
                        setError("")
                    }
                    else {
                        setError("Invitation failed!")
                        setSuccess("")
                    }
                }
                else {
                    setError("User not found!")
                }
            }
            catch(err) {
                    console.log(err)
            }
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
                            
                            {error &&
                                <div className="mt-2 text-red-500">
                                    {error}
                                </div>
                            }

                            {success &&
                                <div className="mt-2 text-green-500">
                                    {success}
                                </div>
                            }
                            
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
    const [openNotes, setOpenNotes] = useState(false)
    const [openInvite, setOpenInvite] = useState(false)

    const [openEdit, setOpenEdit] = useState(false)

    const {id: projectId} = useParams()
    const navigate = useNavigate()

    const user = GetUser()
    const isAdmin = project && project.members.find(member => member.member._id === user._id && member.permission === "Admin")

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

    const saveNotes = async(name) => {
        try {
            const promise = await ProjectService.createDocument({
                title: name,
                data: "",
                projectID: project._id
            })

            if(promise.status = 200) {
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

    const deleteNote = async(noteId) => {
        try {
            const promise = await ProjectService.deleteDocument(noteId)
            if(promise) {
                fetchProject()
            }
        } catch(err) {
            console.log(err)
        }
    }

    const deleteProject = async(id) => {
        try {
            const success = await ProjectService.deleteProject(id)
            navigate(-1)
        }
        catch(err) {
            console.log(err)
            alert(err?.response?.data?.error)
        }
    }

    const fetchProject = async() => {
        try {
            const promise = await ProjectService.getProject(projectId)
            setProject(promise.data)
        } catch(err) {
            console.log(err.data.response.error)
        }
    }

    const leaveProject = async(proj_id) => {
        try {
            await ProjectService.leaveProject(proj_id, user._id)
            navigate('/dash')
        } catch(err) {
            console.log(err)
        }
    }

    const kickMember = async(user_id) => {
        try {
            await ProjectService.kickMember(project._id, {memberId: user_id})
            fetchProject()
        } catch(err) {
            console.log(err)
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
                <div className='flex flex-col rounded-lg bg-amber-800 text-white p-4 border'>
                    <div className='font-bold text-xl'>
                        {project.name}
                    </div>
                    <div>
                        {new Date(project.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
                    </div>
                </div>

                {
                    isAdmin &&
                    <div className='flex gap-2'>
                        {
                            [
                                {
                                    name: "Edit",
                                    logo: <MdEdit/>,
                                    onclick: () => setOpenEdit(true)
                                },
                                {
                                    name: "Delete",
                                    logo: <MdDelete/>,
                                    onclick: () => deleteProject(project._id)
                                },
                            ].map(item =>
                                <button
                                    key={item.name}
                                    onClick={item.onclick}
                                    className='flex items-center gap-2 border-black border p-2 transition hover:-translate-y-1 cursor-pointer'
                                >
                                    <div>
                                        {item.name}
                                    </div>
                                    {item.logo}
                                </button>
                            )
                        }

                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                <Popover.Button className={`
                                    flex items-center gap-2 border-black border p-2 transition hover:-translate-y-1 cursor-pointer
                                `}
                                //copy to clipboard
                                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/dash/project/${project._id}`)}
                                >
                                    <div>
                                        Share
                                    </div>
                                    <MdShare/>
                                </Popover.Button>

                                <Popover.Panel className="flex items-center gap-2 absolute z-10 w-48 p-4 bg-white rounded-lg shadow-lg text-sm border">
                                    <div>Copied to Clipboard!</div>
                                    <button onClick={() => close()}>
                                        <MdClose/>
                                    </button>
                                </Popover.Panel>
                                </>
                            )}
                        </Popover>
                    </div>
                }
                

                <div className='flex border whitespace-pre-wrap bg-white p-4 h-3/5'>
                    {project.content}
                </div>

                <div className='flex flex-col border bg-white p-4'>
                    <div className='flex items-center gap-2'>
                        <div className='font-bold text-lg'>
                            Social
                        </div>
                        
                        {
                            isAdmin &&
                            <button className='flex justify-center' title="Add social link"
                                onClick={()=>setOpenSocial(true)}
                            >
                                <MdAddCircle/>
                            </button>
                        }
                    </div>

                    {
                        project.link.length !== 0 &&
                        <div className='flex items-center gap-2 py-2'>
                            {
                                project.link.map(item => 
                                    <div className='flex gap-2' key={item._id}>
                                        <a href={item.name} target="_blank" className='text-3xl hover:text-gray-700'>
                                            {webType.find(wb => wb.name===item.web).web}
                                        </a>

                                        {
                                            isAdmin &&
                                            <button
                                                onClick={()=>deleteLink(item._id)}
                                            >
                                                <MdDelete className='hover:text-red-400 text-gray-700'/>
                                            </button>
                                        }
                                        
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>

                <div className='flex flex-col border bg-white p-4'>
                    <div className='flex items-center gap-2'>
                        <div className='font-bold text-lg'>
                            Notes
                        </div>
                        
                        {
                            isAdmin &&
                            <button className='flex justify-center' title="Add social link"
                                onClick={()=>setOpenNotes(true)}
                            >
                                <MdAddCircle/>
                            </button>
                        }
                    </div>

                    {
                        project.document.length !== 0 &&
                        <div className='flex items-center gap-2 py-2'>
                            {
                                project.members.find(member => member.member._id === user._id) &&
                                project.document.map(item =>
                                    <div className='flex gap-2 border rounded p-2'>
                                        <button className='text-xl hover:text-gray-700' onClick={()=>navigate(`/dash/text/${item._id}`)}>
                                            {item.title}
                                        </button>

                                        {
                                            isAdmin &&
                                            <button
                                                onClick={()=>deleteNote(item._id)}
                                            >
                                                <MdDelete className='hover:text-red-400 text-gray-700'/>
                                            </button>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>

                <div className='flex flex-col'>
                    
                    <div className='flex z-10 rounded-lg bg-amber-600 p-4 drop-shadow-md'>
                        <div className='grow text-lg font-bold'>
                            Members
                        </div>

                        {
                            isAdmin &&
                            <button className='hover:text-white duration-500 text-2xl'
                                title="Invite a person"
                                onClick={()=>setOpenInvite(true)}
                            >
                                <MdPersonAdd/>
                            </button>
                        }

                        {
                            project.members.find(member => member.member._id === user._id) && !isAdmin &&
                            <button className='flex items-center text-white hover:text-red-800'
                                onClick={() => leaveProject(project._id)}
                            >
                                <MdDoorBack/>
                                Leave
                            </button>
                        }
                    </div>

                    <div className="bg-white p-4 pt-8 rounded-b-lg -translate-y-4 gap-2 flex flex-col border">
                        {project.members.map(user => (
                            <div className='flex items-center gap-2 drop-shadow-md'>
                                <ProfilePic src={user.member.profilePic}/>
                                <div>
                                {user.member.username}
                                </div>
                                <div className='font-bold'>
                                    {user.permission === "Admin" && user.permission}
                                </div>
                                {
                                    isAdmin && user.permission !== "Admin" &&
                                    <button className='hover:text-red-800'
                                        onClick={() => kickMember(user.member._id)}>
                                        <MdDelete/>
                                    </button>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AddSocialComponent
                open={openSocial}
                setOpen={setOpenSocial}
                save={saveLink}
                definedWebType={project.link.map(item => item.web)}
            />

            <AddNotesComponent
                open={openNotes}
                setOpen={setOpenNotes}
                save={saveNotes}
            />

            <InviteMemberComponent
                open={openInvite}
                setOpen={setOpenInvite}
                project={project}
            />

            { 
                project &&
                <EditProject
                    open={openEdit}
                    handleClose={()=>setOpenEdit(false)}
                    inputProject={project}
                    setInputProject={setProject}
                />
            }
            
        </div>
        :
        <div className='border'>
            <Loading/>
        </div>
    )
}

export default ProjectPage