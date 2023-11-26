import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PostService from '../../../services/postService'
import ProjectService from '../../../services/projectService'

import AddNormalPost from './AddNormalPost'
import AddLFTPost from './AddLFTPost'
import AddLFMPost from './AddLFMPost'

const AddPostNavigation = ({
    open,
    setOpen,
}) => {
    return (
        <>
        {
        open &&
            {
                "normal":
                    <AddNormalPost open={open} setOpen={setOpen} question={open === "question"}/>,
                "question":
                    <AddNormalPost open={open} setOpen={setOpen} question={open === "question"}/>,
                "LFT":
                    <AddLFTPost open={open} setOpen={setOpen}/>,
                "LFM":
                    <AddLFMPost open={open} setOpen={setOpen}/>
            }[open]
        }
        </>
    )
}

export default AddPostNavigation