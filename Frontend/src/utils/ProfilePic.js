import React from 'react';
import { GetUser } from '../services/authComponent';

const ProfilePic = ({
    src = null,
    width = 10, 
    height = 10
}) => {
    const user = GetUser()
    if(src === null) src = "/images/profile.svg"
    else if(src === "self") src = user.profilePic || "/images/profile.svg"

    return <img className={`rounded-full w-${width} h-${height} bg-gray-200 object-cover`} src={src}/>
}

export default ProfilePic