import React, { useState } from 'react'
import TransitionDialog from '../../../utils/TransitionDialog'
import { Listbox } from '@headlessui/react'
import { postCategory } from '../AddPost/category'
import { MdExpandMore } from 'react-icons/md'
import ProjectService from '../../../services/projectService'

const EditProject = ({
    open,
    handleClose,
    inputProject,
    setInputProject,
}) => {
    const [project, setProject] = useState({
        name: inputProject.name,
        content: inputProject.content,
    })

    const [category, setCategory] = useState(inputProject.category)

    const handleProject = (e) => {
        setProject(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const editProject = async() => {
        try {
            const success = await ProjectService.updateProject(inputProject._id, {
                name: project.name,
                content: project.content,
                category: project.category,
            })
            
            if(success.status === 200)
                setInputProject(prev => ({...prev, name: project.name, content: project.content, category: project.category}))
            handleClose()
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
                        value={project.name}
                        onChange={handleProject}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="content">Content</label>
                    <textarea 
                        name="content" 
                        id="content" 
                        cols="30" rows="10" 
                        className="border border-gray-300 rounded-md p-2"
                        value={project.content}
                        onChange={handleProject}
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
                <div className="flex justify-end space-x-4">
                    <button 
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        onClick={editProject}
                    >
                        Save
                    </button>
                </div>
            </div>
        </TransitionDialog>
    )
}

export default EditProject