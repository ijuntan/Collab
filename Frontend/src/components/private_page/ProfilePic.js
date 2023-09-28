import React, { useContext } from 'react';
import { UserContext } from '../../services/authComponent';

const ProfilePic = ({width = 10, height = 10}) => {
    const { user } = useContext(UserContext);

    return <img className={`rounded-full w-${width} h-${height} bg-gray-200 object-cover`} src={user?.profilePic || "/images/profile.svg"}/>
}

export default ProfilePic